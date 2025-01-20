'use client'

import { useSail, useTXHandlers } from '@rockooor/sail'
import type { PublicKey } from '@solana/web3.js'
import { DEFAULT_LOCKER_PARAMS } from '@tribecahq/tribeca-sdk'
import invariant from 'tiny-invariant'

import { Alert } from '@/components/tribeca/Alert'
import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { Card } from '@/components/tribeca/Card'
import { CardWithImage } from '@/components/tribeca/CardWithImage'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import { ProseSmall } from '@/components/tribeca/typography/Prose'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import {
    createAndSyncSnapshots,
    syncSnapshots,
    useSnapshotHistories,
} from '@/hooks/tribeca/locker/useSnapshotHistories'
import TimeTravel from './TimeTravel.svg'

interface LockerSnapshotsBasicProps {
    owner?: PublicKey | null
}

function LockerSnapshotsBasic({ owner }: LockerSnapshotsBasicProps) {
    const { tribecaMut } = useSDK()
    const { refetchMany } = useSail()
    const { wrapTx } = useWrapTx()
    const {
        eras,
        lockerKey,
        escrow,
        escrowKey,
        hasMissingHistories,
        estimatedCost,
        unsyncedSnapshots,
    } = useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey)
    const { lockerData } = useGovernor()
    const { signAndConfirmTXs } = useTXHandlers()

    const minVotes = lockerData?.account.params.proposalActivationMinVotes ?? 
        DEFAULT_LOCKER_PARAMS.proposalActivationMinVotes

    if (!owner || escrow?.escrow.amount.gte(minVotes)) {
        return null
    }

    if (hasMissingHistories) {
        return (
            <CardWithImage
                title="Set up Snapshots"
                image={
                    <div className="flex items-center justify-center p-8">
                        <TimeTravel className="w-3/4 h-3/4 text-saber" />
                    </div>
                }
            >
                <ProseSmall>
                    <p>
                        Create snapshots of your vote escrow in order to earn rewards and
                        participate in airdrops.
                    </p>
                    <ExternalLink href="https://docs.tribeca.so/features/snapshots">
                        Learn more about Snapshots
                    </ExternalLink>
                    <AsyncButton
                        className="mt-4"
                        variant="primary"
                        disabled={!lockerKey || !escrowKey}
                        onClick={async (sdkMut) => {
                            invariant(lockerKey && escrowKey)
                            const { createTXs, syncTXs } = await createAndSyncSnapshots({
                                provider: sdkMut.provider,
                                refetchMany,
                                locker: lockerKey,
                                escrow: escrowKey,
                                eras,
                            })
                            await signAndConfirmTXs(
                                await wrapTx(createTXs.slice()),
                                'Create Snapshots'
                            )
                            await signAndConfirmTXs(
                                await wrapTx(syncTXs.slice()),
                                'Sync Snapshots'
                            )
                        }}
                    >
                        Setup (costs ~{estimatedCost?.formatUnits()})
                    </AsyncButton>
                </ProseSmall>
            </CardWithImage>
        )
    }

    if (!escrow?.escrow.amount.gte(minVotes)) {
        return null
    }

    function isNumberArray(value: unknown): value is number[] {
        return Array.isArray(value) && value.every(item => typeof item === 'number')
    }

    return (
        <Card title="Snapshots" padded>
            {isNumberArray(unsyncedSnapshots) && unsyncedSnapshots.length > 0 ? (
                <Alert>
                    <ProseSmall>
                        <h2>Your snapshots are out of sync</h2>
                        <p>
                            Your balance snapshots are out of sync. You could be missing
                            out on reward distributions or airdrops.
                        </p>
                        <ExternalLink href="https://docs.tribeca.so/features/snapshots">
                            Learn more about Snapshots
                        </ExternalLink>
                        <AsyncButton
                            className="mt-4"
                            variant="primary"
                            onClick={async (sdkMut) => {
                                invariant(lockerKey && escrowKey)
                                const syncTXs = await syncSnapshots({
                                    provider: sdkMut.provider,
                                    locker: lockerKey,
                                    escrow: escrowKey,
                                    eras: unsyncedSnapshots,
                                })
                                await signAndConfirmTXs(
                                    await wrapTx(syncTXs),
                                    'Sync Snapshots'
                                )
                            }}
                        >
                            Sync Snapshots ({unsyncedSnapshots.length} TXs)
                        </AsyncButton>
                    </ProseSmall>
                </Alert>
            ) : (
                <div className="text-center">
                    Your balance snapshots are up to date. 👍
                </div>
            )}
        </Card>
    )
}

export { LockerSnapshotsBasic }