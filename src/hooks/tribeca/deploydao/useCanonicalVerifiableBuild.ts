'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import { useQuery } from '@tanstack/react-query'

import type { VerifiableProgramRelease } from './types'

const DEPLOYDAO_BASE_URL = 'https://raw.githubusercontent.com/DeployDAO/solana-program-index/master'

/**
 * Fetches verifiable build information from DeployDAO by checksum
 */
export const fetchCanonicalVerifiableBuild = async (
    checksum: string
): Promise<VerifiableProgramRelease | null> => {
    if (!checksum) {
        return null
    }

    return await fetchNullableWithSessionCache<VerifiableProgramRelease>(
        `${DEPLOYDAO_BASE_URL}/releases/by-trimmed-checksum/${checksum}.json`
    )
}

/**
 * Hook to fetch and cache verifiable build information
 */
export function useCanonicalVerifiableBuild(checksum: string) {
    return useQuery({
        queryKey: ['canonicalVerifiableBuild', checksum],
        queryFn: () => fetchCanonicalVerifiableBuild(checksum),
    })
}