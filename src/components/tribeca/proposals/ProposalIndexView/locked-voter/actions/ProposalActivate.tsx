'use client'

import { useSail, useTXHandlers } from '@rockooor/sail'
import { sleep } from '@saberhq/token-utils'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import invariant from 'tiny-invariant'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { formatDurationSeconds } from '@/utils/tribeca/format'

interface Props {
    proposal: ProposalInfo
    onActivate: () => void
}

/**
 * Component for activating a proposal
 */
function ProposalActivate({ proposal, onActivate }: Props) {
    const { minActivationThreshold, path, governorData, governorW } = useGovernor()
    const { data: escrow, veBalance, refetch } = useUserEscrow()
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()
    const { signAndConfirmTX } = useTXHandlers()

    const earliestActivationTime = useMemo(
        () => governorData
            ? new Date(
                proposal.proposalData.createdAt
                    .add(governorData.account.params.votingDelay)
                    .toNumber() * 1_000
            )
            : null,
        [governorData, proposal.proposalData.createdAt]
    )

    useEffect(() => {
        if (!earliestActivationTime) return
        
        const remainingTime = earliestActivationTime.getTime() - Date.now()
        const timeout = setTimeout(() => {
            void refetch()
        }, remainingTime + 1)
        
        return () => clearTimeout(timeout)
    }, [earliestActivationTime, refetch])

    const handleActivate = async () => {
        invariant(escrow)
        const tx = escrow.escrowW.activateProposal(proposal.proposalKey)
        await signAndConfirmTX(await wrapTx(tx), 'Activate Proposal')
        await sleep(1_000)
        await refetch()
        onActivate()
    }

    const handleCancel = async () => {
        const tx = governorW.cancelProposal({
            proposal: proposal.proposalKey,
        })
        const handle = await handleTX(await wrapTx(tx), 'Cancel Proposal')
        if (!handle.pending) return
        await handle.pending.wait()
    }

    return (
        <Card title="Actions">
            <div className="px-7 py-4 text-sm">
                {!earliestActivationTime || !governorData ? (
                    <LoadingPage />
                ) : earliestActivationTime > new Date() ? (
                    <div className="flex flex-col gap-2">
                        <p>
                            You must wait{' '}
                            {formatDurationSeconds(
                                governorData.account.params.votingDelay.toNumber()
                            )}{' '}
                            for this proposal to be activated.
                        </p>
                        <p>
                            The proposal may be activated at{' '}
                            {earliestActivationTime?.toLocaleString(undefined, {
                                timeZoneName: 'short',
                            })}{' '}
                            by anyone who possesses at least{' '}
                            {minActivationThreshold?.formatUnits()}.
                        </p>
                    </div>
                ) : minActivationThreshold &&
                  veBalance?.greaterThan(minActivationThreshold) ? (
                        <div className="flex justify-center items-center">
                            <Button
                                disabled={!escrow}
                                className="w-3/4 dark:text-white hover:dark:text-saber hover:dark:border-primary"
                                variant="outline"
                                onClick={handleActivate}
                            >
                                Activate Proposal
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p>
                                You must have at least{' '}
                                <strong>{minActivationThreshold?.formatUnits()}</strong> to
                                activate this proposal for voting.
                            </p>
                            {veBalance ? (
                                <p>You currently have {veBalance?.formatUnits()}.</p>
                            ) : (
                                <p>You currently don&apos;t have any tokens vote locked.</p>
                            )}
                            <Link 
                                className="flex justify-center items-center" 
                                href={`${path}/locker`}
                            >
                                <Button className="w-3/4 mt-4">Lock Tokens</Button>
                            </Link>
                        </div>
                    )}
                <div className="flex flex-col gap-2">
                    {governorW &&
                        proposal.proposalData.proposer.equals(
                            governorW.provider.wallet.publicKey
                        ) && (
                        <div className="flex justify-center items-center">
                            <Button
                                variant="outline-danger"
                                className="w-3/4 mt-4"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}

export { ProposalActivate }