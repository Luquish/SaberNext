'use client'

// import { fetchNullableWithSessionCache } from '@rockooor/sail'
// import { formatNetwork } from '@saberhq/solana-contrib'
// import { useQuery } from '@tanstack/react-query'
// import type { GovernorConfig, GovernorConfigJSON } from '@tribecahq/registry'
import { GovernorConfigJSON } from '@tribecahq/registry'
import { useMemo } from 'react'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { REGISTRY_DATA } from '@/config/tribeca/RegistryData'
import { NetworkType } from '@/config/tribeca/RegistryData'


// const REGISTRY_URL =
//     'https://raw.githubusercontent.com/TribecaHQ/tribeca-registry-build/master/registry/governor-metas'

// const CDN_REGISTRY_URL =
//     'https://cdn.jsdelivr.net/gh/TribecaHQ/tribeca-registry-build@master/registry/governor-metas'

// /**
//  * Performs a GET request with a cache, returning `null` if 404.
//  *
//  * The cache expires on browser reload.
//  *
//  * @param url
//  * @param signal
//  * @returns
//  */
// async function fetchNullableWithFallbacks<T>(
//     url: string,
//     fallbacks: readonly string[],
//     signal?: AbortSignal
// ): Promise<T | null> {
//     console.log('Attempting to fetch from primary URL:', url);
//     try {
//         const result = await fetchNullableWithSessionCache<T>(url, signal);
//         console.log('Primary URL fetch result:', !!result);
//         return result;
//     } catch (e) {
//         console.error('Primary URL fetch failed:', e);
        
//         for (const fallback of fallbacks) {
//             console.log('Attempting fallback URL:', fallback);
//             try {
//                 const result = await fetchNullableWithSessionCache<T>(fallback, signal);
//                 console.log('Fallback URL fetch result:', !!result);
//                 return result;
//             } catch (e) {
//                 console.error('Fallback fetch failed:', e);
//                 continue;
//             }
//         }
        
//         console.error('All URLs failed');
//         // En lugar de lanzar un error, retornamos null
//         return null;
//     }
// }

// export function useTribecaRegistry() {
//     const { network } = useEnvironment();
//     console.log('1. useEnvironment network:', network);
//     console.log('Network type:', typeof network);
    
//     console.log('2. Antes de useQuery');
//     const result = useQuery<GovernorConfig[], Error>({
//         queryKey: ['tribecaRegistry', network],
//         queryFn: async ({ signal }) => {
//             console.log('3. Dentro de queryFn');
//             const data = await fetchNullableWithFallbacks<readonly GovernorConfigJSON[]>(
//                 `${REGISTRY_URL}.${formatNetwork(network)}.json`,
//                 [`${CDN_REGISTRY_URL}.${formatNetwork(network)}.json`],
//                 signal
//             )
            
//             if (!data) {
//                 throw new Error('No data available');
//             }
            
//             return data.map(loadGovernorConfig)
//         },
//         enabled: !!network,
//         staleTime: 1000 * 60 * 5,
//         retry: 1,
//     })
//     console.log('7. Después de useQuery, result:', result);
//     return result;
// }


export function useTribecaRegistry() {
    const { network } = useEnvironment()
    
    return useMemo(() => {
        if (!network) {
            return {
                data: undefined as readonly GovernorConfigJSON[] | undefined,
                isLoading: false,
                isFetched: false,
                error: new Error('Network not available'),
            }
        }

        const networkData = REGISTRY_DATA[network as NetworkType]
        
        if (!networkData) {
            return {
                data: undefined as readonly GovernorConfigJSON[] | undefined,
                isLoading: false,
                isFetched: true,
                error: new Error(`No data available for network: ${network}`),
            }
        }

        try {
            return {
                data: networkData,
                isLoading: false,
                isFetched: true,
                error: null,
            }
        } catch (error) {
            return {
                data: undefined as readonly GovernorConfigJSON[] | undefined,
                isLoading: false,
                isFetched: true,
                error: error instanceof Error ? error : new Error('Failed to load governor config'),
            }
        }
    }, [network])
}