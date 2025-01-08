'use client'

import { useTXHandlers } from '@rockooor/sail'
import { SNAPSHOTS_CODERS, SnapshotsSDK } from '@saberhq/snapshots'
import type { PublicKey } from '@solana/web3.js'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { useMinBalanceRentExempt } from '@/hooks/tribeca/useMinBalanceRentExempt'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface CreateEscrowHistoryButtonProps {
    escrow: PublicKey
    era: number
}

const ESCROW_HISTORY_SIZE = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
    SNAPSHOTS_CODERS.Snapshots.idl.accounts[1]
)

/**
 * Button to create escrow history for a specific era
 */
function CreateEscrowHistoryButton({ escrow, era }: CreateEscrowHistoryButtonProps) {
    const { data: cost } = useMinBalanceRentExempt({ size: ESCROW_HISTORY_SIZE })
    const { signAndConfirmTX } = useTXHandlers()
    const { wrapTx } = useWrapTx()

    const handleCreateHistory = async (sdkMut: any) => {
        const sdk = SnapshotsSDK.load({ provider: sdkMut.provider })
        const { tx } = await sdk.snapshots.createEscrowHistory({
            escrow,
            era,
        })
        await signAndConfirmTX(
            await wrapTx(tx),
            `Create Escrow History for era ${era}`
        )
    }

    return (
        <AsyncButton onClick={handleCreateHistory}>
            Create Escrow History (costs {cost?.formatUnits()})
        </AsyncButton>
    )
}

export { CreateEscrowHistoryButton }