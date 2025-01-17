'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import type { Network } from '@saberhq/solana-contrib'
import { formatNetwork } from '@saberhq/solana-contrib'
import { useState, useEffect } from 'react'
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
    const [state, setState] = useState<{
        data: GovernorConfig | null
        isLoading: boolean
        isFetched: boolean
        error: Error | null
    }>({
        data: null,
        isLoading: true,
        isFetched: false,
        error: null,
    })

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const raw = await fetchNullableWithSessionCache<GovernorConfigJSON>(
                    makeManifestURL(network, slug)
                )
                
                setState({
                    data: raw ? loadGovernorConfig(raw) : null,
                    isLoading: false,
                    isFetched: true,
                    error: null,
                })
            } catch (error) {
                setState({
                    data: null,
                    isLoading: false,
                    isFetched: true,
                    error: error as Error,
                })
            }
        }

        fetchManifest()
    }, [network, slug])

    return {
        data: state.data,
        isLoading: state.isLoading,
        isFetched: state.isFetched,
        error: state.error,
    }
}