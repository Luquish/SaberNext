'use client'

import { findTransactionAddress } from '@gokiprotocol/client'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to fetch transaction address for a smart wallet and index
 * @param smartWalletKey - The smart wallet's public key
 * @param index - The transaction index
 */
function useTXAddress(smartWalletKey: PublicKey, index: number) {
    return useQuery({
        queryKey: ['parsedTXAddress', smartWalletKey.toString(), index],
        queryFn: async () => {
            const [txKey] = await findTransactionAddress(smartWalletKey, index)
            return txKey
        },
    })
}

export { useTXAddress }