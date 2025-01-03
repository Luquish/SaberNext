import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { executeMultipleTxs } from '@/utils/saber/transaction'
import useQuarryMiner from './useQuarryMiner'
import useProvider from '../useProvider'
import { getClaimIxs } from '@/utils/saber/claim'
import useQuarry from '../useQuarry'
import type { PoolData } from '@/types/saber'

/**
 * Hook for claiming rewards from a pool
 * @param pool The pool to claim rewards from
 * @returns Object containing the claim function
 */
export default function useClaim(pool: PoolData) {
    const { connection } = useConnection()
    const { wallet } = useWallet()
    const { data: miner } = useQuarryMiner(pool.info.lpToken, true)
    const { data: quarry } = useQuarry()
    const { saber } = useProvider()

    /**
     * Claims rewards from the pool
     * @throws Will throw an error if the transaction fails
     */
    const claim = async (): Promise<void> => {
        // Validate required dependencies
        if (!miner || !quarry || !wallet?.adapter.publicKey || !saber) {
            console.warn('Missing required dependencies for claim')
            return
        }

        try {
            // Get claim instructions
            const txs = await getClaimIxs(saber, quarry.sdk, miner, pool, wallet)
            
            // Execute claim transactions
            await executeMultipleTxs(connection, txs, wallet)
        } catch (error) {
            console.error('Error claiming rewards:', error)
            throw error // Re-throw to allow handling by caller
        }
    }

    return { claim }
}