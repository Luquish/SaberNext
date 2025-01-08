'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { useEnvironment } from './useEnvironment'

/**
 * Hook to fetch signatures for a given address
 * @param address - The public key to fetch signatures for
 * @returns Query result containing signatures
 */
function useSignaturesForAddress(address: PublicKey | null | undefined) {
    const { network } = useEnvironment()
    const { connection } = useConnection()

    return useQuery({
        queryKey: ['signaturesForAddress', network, address?.toString()],
        queryFn: async () => {
            invariant(address, 'Address is required')
            return connection.getSignaturesForAddress(
                address,
                undefined,
                'confirmed'
            )
        },
        enabled: !!address,
    })
}

export { useSignaturesForAddress }