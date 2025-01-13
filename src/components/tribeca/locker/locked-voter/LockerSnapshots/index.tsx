'use client'

import {
    COMMON_ERA_UNIX_TS,
    ERA_NUM_PERIODS,
    PERIOD_SECONDS,
} from '@saberhq/snapshots'
import type { PublicKey } from '@solana/web3.js'

import { Card } from '@/components/tribeca/Card'
import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { useSDK } from '@/contexts/tribeca/sdk'
import { CreateEscrowHistoryButton } from './CreateEscrowHistoryButton'
import { CreateLockerHistoryButton } from './CreateLockerHistoryButton'
import { SyncEscrowHistoryButton } from './SyncEscrowHistoryButton'
import { useSnapshotHistories } from '@/hooks/tribeca/locker/useSnapshotHistories'

const SECONDS_PER_ERA = PERIOD_SECONDS * ERA_NUM_PERIODS

interface LockerSnapshotsProps {
    owner?: PublicKey | null
}

/**
 * Calculates the start date of an era
 */
function calculateEraStart(era: number): Date {
    return new Date((COMMON_ERA_UNIX_TS + era * SECONDS_PER_ERA) * 1_000)
}

/**
 * Component that displays locker snapshots and allows creation/syncing of history
 */
function LockerSnapshots({ owner }: LockerSnapshotsProps) {
    const { tribecaMut } = useSDK()
    const { lockerHistories, escrowHistories, eras, lockerKey, escrow } =
        useSnapshotHistories(owner ?? tribecaMut?.provider.walletKey)

    if (!lockerKey) {
        return null
    }

    return (
        <Card title="Snapshots">
            <TableCardBody
                head={
                    <tr>
                        <th>#</th>
                        <th>Period</th>
                    </tr>
                }
            >
                {eras?.map((era, i) => {
                    const lockerHistory = lockerHistories?.[i]
                    const escrowHistory = escrowHistories?.[i]

                    const startIndex = escrowHistory?.account.veBalances.findIndex(
                        (v) => !v.isZero()
                    )
                    const endIndexReversed = escrowHistory?.account.veBalances
                        .slice()
                        .reverse()
                        .findIndex((v) => !v.isZero())
                    const endIndex =
                        endIndexReversed !== undefined
                            ? endIndexReversed !== -1
                                ? ERA_NUM_PERIODS - endIndexReversed - 1
                                : -1
                            : undefined

                    return (
                        <tr key={era}>
                            <td>{era}</td>
                            <td>
                                {calculateEraStart(era).toLocaleDateString()} to{' '}
                                {calculateEraStart(era + 1).toLocaleDateString()}
                            </td>
                            <td>
                                <div>
                                    <p>Starts: {startIndex}</p>
                                    <p>Ends: {endIndex}</p>
                                </div>
                            </td>
                            <td>
                                {lockerHistory === undefined ||
                                (escrow && escrowHistory === undefined) ? (
                                        <LoadingSpinner />
                                    ) : lockerHistory === null ? (
                                        <CreateLockerHistoryButton 
                                            locker={lockerKey} 
                                            era={era} 
                                        />
                                    ) : !escrowHistory ? (
                                        escrow ? (
                                            <CreateEscrowHistoryButton
                                                escrow={escrow.escrowW.escrowKey}
                                                era={era}
                                            />
                                        ) : (
                                            'No veTokens locked'
                                        )
                                    ) : (
                                        <SyncEscrowHistoryButton
                                            lockerHistory={lockerHistory}
                                            escrowHistory={escrowHistory}
                                        />
                                    )}
                            </td>
                        </tr>
                    )
                })}
            </TableCardBody>
        </Card>
    )
}

export { LockerSnapshots }