import { findGaugeAddress } from '@quarryprotocol/gauge'
import { findQuarryAddress } from '@quarryprotocol/quarry-sdk'
import { useRewarder } from '@rockooor/react-quarry'
import { useToken } from '@rockooor/sail'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { useGM } from '@/contexts/tribeca/gauges'
import { useBatchedGauges, useGaugeData } from '@/utils/tribeca/parsers'
import { useGaugemeister } from './useGaugemeister'

/**
 * Hook to get all gauge keys for the current rewarder
 * @returns Array of gauge public keys
 */
export function useGaugeKeys() {
    const gaugemeister = useGaugemeister()
    const { allStakedTokenMints, rewarderKey, registry } = useRewarder()
    
    const { data: gaugeKeys } = useQuery({
        queryKey: ['gaugeKeys', gaugemeister?.toString(), rewarderKey.toString()],
        queryFn: async () => {
            invariant(allStakedTokenMints && gaugemeister)
            
            const keys = await Promise.all(
                allStakedTokenMints.map(async (stakedTokenMint) => {
                    const [quarryKey] = await findQuarryAddress(
                        rewarderKey,
                        stakedTokenMint,
                    )
                    const [key] = await findGaugeAddress(gaugemeister, quarryKey)
                    return key
                }) ?? [],
            )
            return keys
        },
        enabled: allStakedTokenMints !== undefined && !!registry && !!gaugemeister,
    })

    return gaugeKeys
}

/**
 * Hook to get gauge data for a specific staked token mint
 * @param stakedTokenMint - The public key of the staked token mint
 * @returns Object containing gauge key, gauge data and token data
 */
export function useGauge(stakedTokenMint: PublicKey | null | undefined) {
    const { rewarderKey, gaugemeister } = useGM()
    
    const { data: gaugeKey } = useQuery({
        queryKey: [
            'gaugeKeyForStakedToken',
            gaugemeister?.toString(),
            stakedTokenMint?.toString(),
        ],
        queryFn: async () => {
            invariant(rewarderKey && stakedTokenMint && gaugemeister)
            const [quarryKey] = await findQuarryAddress(rewarderKey, stakedTokenMint)
            const [key] = await findGaugeAddress(gaugemeister, quarryKey)
            return key
        },
        enabled: !!rewarderKey && !!stakedTokenMint && !!gaugemeister,
    })

    const { data: gauge } = useGaugeData(gaugeKey)
    const { data: token } = useToken(stakedTokenMint)

    return { gaugeKey, gauge, token }
}

/**
 * Hook to get all gauges and their keys
 * @returns Object containing arrays of gauge data and gauge keys
 */
export function useAllGauges() {
    const gaugeKeys = useGaugeKeys()
    const { data: gauges } = useBatchedGauges(gaugeKeys)
    
    return { gauges, gaugeKeys }
}