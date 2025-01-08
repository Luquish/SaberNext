'use client'

import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'

import { DEPLOYDAO_BASE_URL } from '@/utils/tribeca/constants'
import type { ProgramInfo } from './types'

/**
 * Extended ProgramInfo with PublicKey instead of string address
 */
interface ProgramInfoParsed extends Omit<ProgramInfo, 'address'> {
    address: PublicKey
}

/**
 * Hook to fetch and parse the Solana program index from DeployDAO
 */
export const useProgramIndex = () => {
    return useQuery({
        queryKey: ['solanaProgramIndex'],
        queryFn: async (): Promise<ProgramInfoParsed[]> => {
            const result = await fetch(
                `${DEPLOYDAO_BASE_URL}/programs.json`
            )
            const parsed = (await result.json()) as ProgramInfo[]
            
            return parsed.map((p) => ({ 
                ...p,
                address: new PublicKey(p.address),
            }))
        },
    })
}