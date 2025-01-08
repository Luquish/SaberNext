'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import type { Network } from '@saberhq/solana-contrib'
import { formatNetwork } from '@saberhq/solana-contrib'
import { useQuery } from '@tanstack/react-query'
import type { GovernorConfig, GovernorConfigJSON } from '@tribecahq/registry'
import { loadGovernorConfig } from '@tribecahq/registry'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'

const makeManifestURL = (network: Network, slug: string) => {
    return `https://raw.githubusercontent.com/TribecaHQ/tribeca-registry-build/master/registry/${formatNetwork(
        network
    )}/${slug}.json`
}

export function useGovernanceManifest(slug: string) {
    const { network } = useEnvironment()
    
    return useQuery<GovernorConfig | null>({
        queryKey: ['governanceManifest', network, slug],
        queryFn: async () => {
            const raw = await fetchNullableWithSessionCache<GovernorConfigJSON>(
                makeManifestURL(network, slug)
            )
            if (!raw) {
                return null
            }
            return loadGovernorConfig(raw)
        },
    })
}