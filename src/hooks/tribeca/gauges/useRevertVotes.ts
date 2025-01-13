'use client'

import { GaugeSDK } from '@quarryprotocol/gauge'
import { useSail } from '@rockooor/sail'
import { TransactionEnvelope } from '@saberhq/solana-contrib'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

import { useSDK } from '@/contexts/tribeca/sdk'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { useGaugemeister } from './useGaugemeister'
import { useAllGauges } from './useGauges'

/**
 * Hook that handles reverting gauge votes
 * @returns Callback function to execute the revert process
 * @throws Error if the revert transaction fails
 */
export function useRevertVotes() {
    const { gaugeKeys } = useAllGauges()
    const { sdkMut } = useSDK()
    const { handleTXs } = useSail()
    const { wrapTx } = useWrapTx()
    const gaugemeister = useGaugemeister()

    return useCallback(async () => {
        invariant(sdkMut && gaugemeister && gaugeKeys)
        
        // Initialize gauge SDK
        const gauge = GaugeSDK.load({ provider: sdkMut.provider })

        // Revert existing votes
        const revertTXs = await gauge.gauge.revertVotes({
            gaugemeister,
            gauges: gaugeKeys,
        })

        // Handle and confirm transactions
        const { pending, success } = await handleTXs(
            await wrapTx(TransactionEnvelope.pack(...revertTXs)),
            'Revert votes',
        )

        if (!success) {
            throw new Error('Could not revert votes')
        }

        // Wait for all pending transactions
        return await Promise.all(pending.map((p) => p.wait()))
    }, [gaugeKeys, gaugemeister, handleTXs, sdkMut, wrapTx])
}