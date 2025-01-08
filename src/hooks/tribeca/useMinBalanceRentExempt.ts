'use client'

import { RAW_SOL, TokenAmount } from '@saberhq/token-utils'
import { useConnection } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'

import { useEnvironment } from './useEnvironment'

interface UseMinBalanceRentExemptProps {
    size: number
}

/**
 * Fetches the minimum rent exempt balance.
 * @param size : ;
 * @returns
 */
export function useMinBalanceRentExempt({
    size,
}: UseMinBalanceRentExemptProps) {
    const { connection } = useConnection()
    const { network } = useEnvironment()
    return useQuery({
        queryKey: ['minBalanceRentExempt', network, size],
        queryFn: async () => {
            const lamports = await connection.getMinimumBalanceForRentExemption(
                size
            )
            return new TokenAmount(RAW_SOL[network], lamports)
        },
    })
}
