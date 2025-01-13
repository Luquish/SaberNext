import type { GaugeVoteData } from '@quarryprotocol/gauge'
import {
    findGaugeVoteAddress,
    findGaugeVoterAddress,
} from '@quarryprotocol/gauge'
import { mapSome } from '@saberhq/solana-contrib'
import type { ProgramAccount } from '@saberhq/token-utils'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import {
    useBatchedGaugeVotes,
    useGaugeVoterData,
} from '@/utils/tribeca/parsers'
import { useGaugemeister } from './useGaugemeister'
import { useGaugeKeys } from './useGauges'

export interface UserGaugeInfo extends GaugeVoteData {
    key: PublicKey,
    weight: number,
    percent: number | null,
}

/**
 * Hook to get gauge voting information for a specific escrow
 * @param escrowKey - The public key of the escrow
 * @returns Object containing gauge voter data, votes, and derived information
 */
export function useVoterGauges(escrowKey: PublicKey | undefined) {
    const gaugemeister = useGaugemeister()
    const gaugeKeys = useGaugeKeys()

    const { data: gaugeVoteKeys } = useQuery({
        queryKey: ['gaugeVoteKeys', escrowKey?.toString()],
        queryFn: async () => {
            invariant(escrowKey && gaugeKeys && gaugemeister)
            
            const [gaugeVoterKey] = await findGaugeVoterAddress(
                gaugemeister,
                escrowKey,
            )
            
            const gaugeVoteKeys = await Promise.all(
                gaugeKeys.map(async (gauge) => {
                    const [gaugeVote] = await findGaugeVoteAddress(gaugeVoterKey, gauge)
                    return gaugeVote
                }) ?? [],
            )
            
            return { gaugeVoterKey, gaugeVoteKeys }
        },
        enabled: !!escrowKey && !!gaugeKeys && !!gaugemeister,
    })

    const { data: gaugeVoter } = useGaugeVoterData(
        mapSome(gaugeVoteKeys, (x) => x.gaugeVoterKey),
    )
    const { data: gaugeVotes } = useBatchedGaugeVotes(
        mapSome(gaugeVoteKeys, (x) => x.gaugeVoteKeys),
    )

    const totalWeight = gaugeVoter ? gaugeVoter.account.totalWeight : gaugeVoter

    const myGauges = useMemo(
        () =>
            gaugeVotes
                ?.filter((gv): gv is ProgramAccount<GaugeVoteData> => !!gv)
                .map((gv): UserGaugeInfo => {
                    const weight = gv.account.weight
                    const percent = typeof totalWeight === 'number' 
                        ? weight / totalWeight 
                        : null
                        
                    return {
                        key: gv.publicKey,
                        ...gv.account,
                        percent,
                    }
                })
                .sort((a, b) => (a.weight > b.weight ? -1 : 1)),
        [gaugeVotes, totalWeight],
    )

    return {
        gaugeVoter,
        gaugeVotes,
        myGauges,
        hasNoGauges:
            !gaugeVotes ||
            (gaugeVotes.length !== 0 && gaugeVotes.every((gv) => gv === null)),
    }
}

/**
 * Hook to get gauge voting information for the current user's escrow
 * @returns Result of useVoterGauges for the current user
 */
export function useMyGauges() {
    const { escrowKey } = useUserEscrow()
    return useVoterGauges(escrowKey)
}