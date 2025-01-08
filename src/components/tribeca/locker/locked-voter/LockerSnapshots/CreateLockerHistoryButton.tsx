'use client'

import { useTXHandlers } from '@rockooor/sail'
import { SNAPSHOTS_CODERS, SnapshotsSDK } from '@saberhq/snapshots'
import type { PublicKey } from '@solana/web3.js'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { useMinBalanceRentExempt } from '@/hooks/tribeca/useMinBalanceRentExempt'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface CreateLockerHistoryButtonProps {
    locker: PublicKey
    era: number
}

const LOCKER_HISTORY_SIZE = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
    SNAPSHOTS_CODERS.Snapshots.idl.accounts[0]
)

/**
 * Button to create locker history for a specific era
 */
function CreateLockerHistoryButton({ locker, era }: CreateLockerHistoryButtonProps) {
    const { data: cost } = useMinBalanceRentExempt({ size: LOCKER_HISTORY_SIZE })
    const { signAndConfirmTX } = useTXHandlers()
    const { wrapTx } = useWrapTx()

    const handleCreateHistory = async (sdkMut: any) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider })
        const { tx } = await sdk.snapshots.createLockerHistory({
            locker,
            era,
        })
        await signAndConfirmTX(
            await wrapTx(tx),
            `Create Locker History for era ${era}`
        )
    }

    return (
        <AsyncButton onClick={handleCreateHistory}>
            Create Locker History (costs {cost?.formatUnits()})
        </AsyncButton>
    )
}

export { CreateLockerHistoryButton }