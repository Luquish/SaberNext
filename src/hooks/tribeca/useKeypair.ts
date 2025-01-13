'use client'

import { Keypair } from '@solana/web3.js'
import { useMemo } from 'react'

interface UseKeypairProps {
    valueStr: string
}

/**
 * Hook to create a Solana Keypair from a secret key string
 * @param valueStr - JSON string of secret key numbers
 * @returns Keypair instance or null if invalid input
 */
function useKeypair({ valueStr }: UseKeypairProps): Keypair | null {
    return useMemo(() => {
        if (!valueStr) {
            return null
        }

        try {
            const secretKeyArray = JSON.parse(valueStr) as number[]
            return Keypair.fromSecretKey(
                Uint8Array.from([...secretKeyArray])
            )
        } catch (e) {
            return null
        }
    }, [valueStr])
}

export { useKeypair }