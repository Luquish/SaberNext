'use client'

// import { fetchNullableWithSessionCache } from '@rockooor/sail'
// import { formatNetwork } from '@saberhq/solana-contrib'
// import { useQuery } from '@tanstack/react-query'
// import type { GovernorConfig, GovernorConfigJSON } from '@tribecahq/registry'
import { GovernorConfigJSON, loadGovernorConfig } from '@tribecahq/registry'
import { useMemo } from 'react'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'


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

// Importar los datos locales
const REGISTRY_DATA: Record<string, GovernorConfigJSON[]> = {
    'devnet': [
        {
            'address': '3mnaXERbCiKkj4XLgpv682YK3o5Cjqti1NxRyoVNLnJp',
            'description': 'Liquidity staking to secure and decentralize Solana',
            'govToken': {
                'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                'chainId': 103,
                'decimals': 9,
                'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade Protocol Token',
                'symbol': 'MNDE',
            },
            'governance': {
                'address': '3mnaXERbCiKkj4XLgpv682YK3o5Cjqti1NxRyoVNLnJp',
                'description': 'Liquidity staking to secure and decentralize Solana',
                'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                'name': 'Marinade',
                'network': 'devnet',
                'slug': 'mnde',
                'token': {
                    'address': 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
                    'chainId': 103,
                    'decimals': 9,
                    'logoURI': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
                    'name': 'Marinade Protocol Token',
                    'symbol': 'MNDE',
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/marinade-finance/liquid-staking-program/main/Docs/img/MNDE.png',
            'links': {
                'app': {
                    'label': 'App',
                    'url': 'https://marinade.finance/app/staking',
                },
                'discord': {
                    'label': 'Discord',
                    'url': 'https://discord.com/invite/6EtUf4Euu6',
                },
                'forum': {
                    'label': 'Forum',
                    'url': 'https://forum.marinade.finance',
                },
                'github': {
                    'label': 'Github',
                    'url': 'https://github.com/marinade-finance',
                },
                'medium': {
                    'label': 'Medium',
                    'url': 'https://medium.com/marinade-finance',
                },
                'twitter': {
                    'label': 'Twitter',
                    'url': 'https://twitter.com/marinadeFinance',
                },
                'website': {
                    'label': 'Website',
                    'url': 'https://marinade.finance',
                },
            },
            'mndeNftLocker': {
                'address': 'rLmyBAjCYR1MNc3KSG77y5XXT2DuMxkcxfqLYvjjJCs',
                'app': 'https://dev.marinade.finance/app/mnde',
                'creators': [
                    '6jG2QcwaJPFS8Y9SzgH2kfKPj6ERhLi9RVtH8kRahj4j',
                ],
                'docs': 'https://docs.marinade.finance/governance',
            },
            'name': 'Marinade',
            'nftLockerGauges': [
                {
                    'address': '7Er1bdJU1Rd5ZuXctcp8BjnZkGQGVJT6gX46pcvqhXKT',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Liquidity',
                },
                {
                    'address': 'mvgmBamY7hDWxLNGLshMoZn8nt2P8tKnKhaBeXMVajZ',
                    'docs': 'https://docs.marinade.finance/governance/gauges',
                    'label': 'Validator',
                    'stateAccount': '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC',
                },
            ],
            'proposals': {
                'discussion': {
                    'link': 'https://forum.marinade.finance/',
                    'prefix': 'https://forum.marinade.finance/t/',
                    'required': true,
                },
                'notice': 'To create a proposal, first make a post on the [Marinade Governance Forum](https://forum.marinade.finance/).\n\n\nOnce you have determined that there is sufficient community support, add the link to the discussion thread and create a proposal.\n',
            },
            'slug': 'mnde',
        },
        {
            'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
            'description': 'AMM for mean-reverting trading pairs on Solana',
            'govToken': {
                'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                'chainId': 103,
                'decimals': 6,
                'extensions': {
                    'coingeckoId': 'saber',
                    'discord': 'https://chat.saber.so',
                    'github': 'https://github.com/saber-hq',
                    'medium': 'https://blog.saber.so',
                    'twitter': 'https://twitter.com/saber_hq',
                    'website': 'https://saber.so',
                },
                'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1/logo.svg',
                'name': 'Saber Protocol Token',
                'symbol': 'SBR',
                'tags': [],
            },
            'governance': {
                'address': '9tnpMysuibKx6SatcH3CWR9ZsSRMBNeBf1mhfL6gAXR4',
                'description': 'AMM for mean-reverting trading pairs on Solana',
                'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1/logo.svg',
                'name': 'Saber',
                'network': 'devnet',
                'slug': 'sbr',
                'token': {
                    'address': 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
                    'chainId': 103,
                    'decimals': 6,
                    'extensions': {
                        'coingeckoId': 'saber',
                        'discord': 'https://chat.saber.so',
                        'github': 'https://github.com/saber-hq',
                        'medium': 'https://blog.saber.so',
                        'twitter': 'https://twitter.com/saber_hq',
                        'website': 'https://saber.so',
                    },
                    'logoURI': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1/logo.svg',
                    'name': 'Saber Protocol Token',
                    'symbol': 'SBR',
                    'tags': [],
                },
            },
            'iconURL': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1/logo.svg',
            'name': 'Saber',
            'saves': [
                {
                    'duration': 31536000,
                    'mint': 'ESm4AoqMaJ8aJR6nNvd7h45hcv83VpC9G6awj8CiDUBT',
                },
            ],
            'slug': 'sbr',
        },
    ],
} as const;

export function useTribecaRegistry() {
    const { network } = useEnvironment()
    
    return useMemo(() => {
        if (!network) {
            return {
                data: undefined,
                isLoading: false,
                isFetched: false,
                error: new Error('Network not available'),
            }
        }

        const networkData = REGISTRY_DATA[network as keyof typeof REGISTRY_DATA]
        
        if (!networkData) {
            return {
                data: undefined,
                isLoading: false,
                isFetched: true,
                error: new Error(`No data available for network: ${network}`),
            }
        }

        try {
            const data = networkData.map(loadGovernorConfig)
            return {
                data,
                isLoading: false,
                isFetched: true,
                error: null,
            }
        } catch (error) {
            return {
                data: undefined,
                isLoading: false,
                isFetched: true,
                error: error instanceof Error ? error : new Error('Failed to load governor config'),
            }
        }
    }, [network])
}