'use client'

import { findOwnerInvokerAddress, findSmartWallet } from '@gokiprotocol/client'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

/**
 * Hook to get smart wallet address from base address
 */
function useSmartWalletAddress(base: PublicKey | null | undefined) {
    return useQuery({
        queryKey: ['walletKey', base?.toString()],
        queryFn: async () => {
            invariant(base, 'Base address is required')
            const [address] = await findSmartWallet(base)
            return address
        },
        enabled: !!base,
    })
}

/**
 * Hook to get owner invoker address from smart wallet
 */
function useOwnerInvokerAddress(
    smartWallet: PublicKey | null | undefined,
    index = 0
) {
    return useQuery({
        queryKey: ['ownerInvoker', smartWallet?.toString()],
        queryFn: async () => {
            invariant(smartWallet, 'Smart wallet address is required')
            const [address] = await findOwnerInvokerAddress(smartWallet, index)
            return address
        },
        enabled: !!smartWallet,
    })
}

export { useSmartWalletAddress, useOwnerInvokerAddress }