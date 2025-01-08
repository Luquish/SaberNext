'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import { DEPLOYDAO_BASE_URL } from '@/utils/tribeca/constants'
import type { ProgramDetails } from './types'

/**
 * Hook to fetch program metadata for multiple addresses
 */
export const useProgramMetas = (addresses: (string | null | undefined)[]) => {
    return useQueries({
        queries: addresses.map((pid) => ({
            queryKey: ['sprMeta', pid],
            queryFn: async (): Promise<ProgramDetails | null> => {
                if (!pid) {
                    return null
                }
                return await fetchNullableWithSessionCache<ProgramDetails>(
                    `${DEPLOYDAO_BASE_URL}/programs/${pid}.json`
                )
            },
            enabled: !!pid,
        })),
    })
}

/**
 * Hook to fetch program metadata for a single address
 */
export const useProgramMeta = (address: string | null | undefined) => {
    const metas = useProgramMetas(useMemo(() => [address], [address]))
    const result = metas[0]
    invariant(result, 'Program meta result should exist')
    return result
}