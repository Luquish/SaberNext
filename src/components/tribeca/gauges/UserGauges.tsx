'use client'

import {
    findEpochGaugeVoterAddress,
    findGaugeVoterAddress,
} from '@quarryprotocol/gauge'
import { ZERO } from '@quarryprotocol/quarry-sdk'
import { useQuery } from '@tanstack/react-query'
import BN from 'bn.js'
import { FaExclamationTriangle } from 'react-icons/fa'
import invariant from 'tiny-invariant'

import { Card } from '@/components/tribeca/Card'
import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { EmptyState, EmptyStateConnectWallet } from '@/components/tribeca/EmptyState'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import { MouseoverTooltip } from '@/components/tribeca/MouseoverTooltip'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useGaugemeister, useGMData } from '@/hooks/tribeca/gauges/useGaugemeister'
import { useMyGauges } from '@/hooks/tribeca/gauges/useMyGauges'
import { useEpochGaugeVoterData, useGaugeVoterData } from '@/utils/tribeca/parsers'
import { LockupTooShortTooltip } from '@/components/tribeca/gauges/lockupTooShortTooltip'
import { SyncModal } from '@/components/tribeca/gauges/SyncModal'
import { UserGauge } from '@/components/tribeca/gauges/UserGauge'

const NUM_GAUGES_TO_DISPLAY = 3

/**
 * Component displaying user's gauge votes and related actions
 */
function UserGauges() {
    const { path } = useGovernor()
    const { sdkMut } = useSDK()
    const { myGauges, hasNoGauges, gaugeVotes } = useMyGauges()
    const gaugemeister = useGaugemeister()
    const { data: gmData } = useGMData()
    const { escrow, escrowKey } = useUserEscrow()
    
    const votingEpoch = gmData ? gmData.account.currentRewardsEpoch + 1 : null

    const { data: epochGaugeVoterKey } = useQuery({
        queryKey: ['epochGaugeVoterKey', votingEpoch],
        queryFn: async () => {
            invariant(votingEpoch && gaugemeister && escrowKey, 'Missing required data')
            const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey)
            const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
                gaugeVoter,
                votingEpoch
            )
            return { gaugeVoter, epochGaugeVoter }
        },
        enabled: !!(votingEpoch !== null && escrowKey && gaugemeister),
    })

    const { data: gaugeVoter } = useGaugeVoterData(
        epochGaugeVoterKey?.gaugeVoter
    )
    
    const { data: epochGaugeVoter } = useEpochGaugeVoterData(
        epochGaugeVoterKey?.epochGaugeVoter
    )

    const expectedPower = gmData && escrow
        ? escrow.calculateVotingPower(gmData.account.nextEpochStartsAt.toNumber())
        : null

    const isVotesChanged =
        gaugeVoter &&
        epochGaugeVoter &&
        expectedPower &&
        !expectedPower
            .sub(epochGaugeVoter.account.allocatedPower)
            .abs()
            .lt(new BN(myGauges?.length ?? 0))

    const isDirty =
        gaugeVoter &&
        (!epochGaugeVoter ||
            !gaugeVoter.account.weightChangeSeqno.eq(
                epochGaugeVoter.account.weightChangeSeqno
            ))

    const showSyncButton = isVotesChanged || isDirty

    const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(
        gmData?.account.nextEpochStartsAt ?? ZERO
    )

    const getLinkTitle = () => {
        if (hasNoGauges) return 'Cast Votes'
        if ((myGauges?.length ?? 0) > NUM_GAUGES_TO_DISPLAY) return 'View All Votes'
        return 'Edit Gauge Votes'
    }

    const renderHeader = () => (
        <tr>
            <th>Gauge</th>
            <th>
                {isDirty || isVotesChanged ? (
                    <div className="flex items-center gap-2">
                        <span>Your Votes</span>
                        <MouseoverTooltip
                            text={
                                isDirty
                                    ? 'Your votes have yet to be committed. Please click the "Sync" button to the right.'
                                    : 'Your voting escrow balance has changed. Please click the Sync button to the right to maximize your voting power.'
                            }
                        >
                            <FaExclamationTriangle className="text-yellow-500" />
                        </MouseoverTooltip>
                    </div>
                ) : (
                    <>Your Votes</>
                )}
            </th>
            <th>Weight</th>
        </tr>
    )

    if (!sdkMut) {
        return <EmptyStateConnectWallet title="Connect your wallet to vote on gauges." />
    }

    if (gaugeVotes === undefined) {
        return (
            <div className="flex h-[195px] w-full justify-center items-center">
                <LoadingPage />
            </div>
        )
    }

    if (hasNoGauges) {
        return <EmptyState title="You haven't voted on any gauges yet." />
    }

    return (
        <Card
            className="flex items-center justify-between"
            title={
                <>
                    <div className="flex">
                        <span>Your Gauge Votes</span>
                        {lockupTooShort && <LockupTooShortTooltip />}
                    </div>
                    {showSyncButton && (
                        <div>
                            <ModalButton
                                buttonLabel="Sync"
                                buttonProps={{
                                    variant: 'outline',
                                }}
                            >
                                <SyncModal />
                            </ModalButton>
                        </div>
                    )}
                </>
            }
            link={
                sdkMut
                    ? {
                        title: getLinkTitle(),
                        href: `${path}/gauges/weights`,
                    }
                    : undefined
            }
        >
            <div className="text-sm w-full whitespace-nowrap overflow-x-auto">
                <TableCardBody head={renderHeader()}>
                    {!myGauges || myGauges.length === 0 ? (
                        <tr>
                            <td colSpan={3}>
                                <div className="flex h-[195px] w-full justify-center items-center">
                                    <LoadingPage />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        myGauges
                            .slice(0, NUM_GAUGES_TO_DISPLAY)
                            .filter((gv) => gv.weight !== 0)
                            .map((gaugeVote, i) => (
                                <UserGauge
                                    className={
                                        i !== myGauges.length - 1
                                            ? 'border-b border-b-warmGray-800'
                                            : ''
                                    }
                                    key={gaugeVote.key.toString()}
                                    gaugeVote={gaugeVote}
                                />
                            ))
                    )}
                    {myGauges && myGauges.length > NUM_GAUGES_TO_DISPLAY && (
                        <tr>
                            <td />
                            <td>{myGauges.length - NUM_GAUGES_TO_DISPLAY} more ... </td>
                            <td />
                        </tr>
                    )}
                </TableCardBody>
            </div>
        </Card>
    )
}

export { UserGauges }