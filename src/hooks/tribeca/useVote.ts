'use client'

import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { findVoteAddress } from '@tribecahq/tribeca-sdk'
import invariant from 'tiny-invariant'

import { useParsedVote } from '@/utils/tribeca/parsers'
import { useEnvironment } from './useEnvironment'

/**
 * Hook to fetch and parse vote data for a proposal and voter
 * @param proposalKey - The proposal's public key
 * @param voter - The voter's public key
 */
function useVote(proposalKey?: PublicKey, voter?: PublicKey) {
    const { network } = useEnvironment()

    const voteKey = useQuery({
        queryKey: ['voteKey', network, proposalKey?.toString(), voter?.toString()],
        queryFn: async () => {
            invariant(proposalKey && voter, 'Proposal key and voter are required')
            const [escrowKey] = await findVoteAddress(proposalKey, voter)
            return escrowKey
        },
        enabled: !!(proposalKey && voter),
    })

    return useParsedVote(voteKey.data)
}

export { useVote }