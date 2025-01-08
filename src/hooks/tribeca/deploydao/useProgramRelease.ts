'use client'

import { useQuery } from '@tanstack/react-query'

import { DEPLOYDAO_BASE_URL } from '@/utils/tribeca/constants'
import type { VerifiableProgramRelease } from './types'

/**
 * Hook to fetch program release information by org, name and version
 */
export const useProgramRelease = (
    org: string,
    programName: string,
    version: string
) => {
    return useQuery({
        queryKey: ['programRelease', org, programName, version],
        queryFn: async (): Promise<VerifiableProgramRelease | null> => {
            const result = await fetch(
                `${DEPLOYDAO_BASE_URL}/releases/by-name/%40${org}/${programName}%40${version}.json`
            )
            
            if (result.status === 404) {
                return null
            }

            const parsed = await result.json() as VerifiableProgramRelease
            return parsed
        },
    })
}