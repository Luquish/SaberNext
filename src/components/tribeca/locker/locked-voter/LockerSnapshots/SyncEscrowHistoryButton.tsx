'use client'

import { useTXHandlers } from '@rockooor/sail'
import type { EscrowHistoryData, LockerHistoryData } from '@saberhq/snapshots'
import { SnapshotsSDK } from '@saberhq/snapshots'
import type { ProgramAccount } from '@saberhq/token-utils'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface SyncEscrowHistoryButtonProps {
    lockerHistory: ProgramAccount<LockerHistoryData>
    escrowHistory: ProgramAccount<EscrowHistoryData>
}

/**
 * Button to sync escrow history with locker history
 */
function SyncEscrowHistoryButton({ 
    lockerHistory,
    escrowHistory,
}: SyncEscrowHistoryButtonProps) {
    const { signAndConfirmTX } = useTXHandlers()
    const { wrapTx } = useWrapTx()

    const handleSync = async (sdkMut: any) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider })
        const tx = sdk.provider.newTX([
            sdk.snapshots.program.instruction.sync({
                accounts: {
                    locker: lockerHistory.account.locker,
                    escrow: escrowHistory.account.escrow,
                    lockerHistory: lockerHistory.publicKey,
                    escrowHistory: escrowHistory.publicKey,
                },
            }),
        ])
        await signAndConfirmTX(await wrapTx(tx), 'Sync Escrow History')
    }

    return (
        <AsyncButton onClick={handleSync}>
            Sync Escrow History
        </AsyncButton>
    )
}

export { SyncEscrowHistoryButton }