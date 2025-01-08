'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import { formatNetwork } from '@saberhq/solana-contrib'
import { useQuery } from '@tanstack/react-query'
import type { GovernorConfig, GovernorConfigJSON } from '@tribecahq/registry'
import { loadGovernorConfig } from '@tribecahq/registry'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'

const REGISTRY_URL =
    'https://raw.githubusercontent.com/TribecaHQ/tribeca-registry-build/master/registry/governor-metas'

const CDN_REGISTRY_URL =
    'https://cdn.jsdelivr.net/gh/TribecaHQ/tribeca-registry-build@master/registry/governor-metas'

/**
 * Performs a GET request with a cache, returning `null` if 404.
 * The cache expires on browser reload.
 */
async function fetchNullableWithFallbacks<T>(
    url: string,
    fallbacks: readonly string[],
    signal?: AbortSignal
): Promise<T | null> {
    try {
        return await fetchNullableWithSessionCache<T>(url, signal)
    } catch (e) {
        for (const fallback of fallbacks) {
            try {
                return await fetchNullableWithSessionCache<T>(fallback, signal)
            } catch (e) {
                continue
            }
        }
    }
    throw new Error('could not fetch any URLs')
}

export function useTribecaRegistry() {
    const { network } = useEnvironment()
    
    return useQuery<GovernorConfig[] | null>({
        queryKey: ['tribecaRegistry', network],
        queryFn: async ({ signal }) => {
            const data = await fetchNullableWithFallbacks<readonly GovernorConfigJSON[]>(
                `${REGISTRY_URL}.${formatNetwork(network)}.json`,
                [`${CDN_REGISTRY_URL}.${formatNetwork(network)}.json`],
                signal
            )
            
            if (!data) {
                return null
            }
            
            return data.map(loadGovernorConfig)
        },
    })
}