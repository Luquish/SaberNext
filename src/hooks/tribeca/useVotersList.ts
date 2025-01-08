'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import { TokenAmount } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { useGovernor } from './useGovernor'

const TRIBECA_VOTERS_BASE_URL = 'https://raw.githubusercontent.com/TribecaHQ/vote-escrow-leaderboard/master/voters'

export interface VotersList {
    count: number
    name: string
    updatedAt: string
    totalVotes: string
    voters: {
        amount: TokenAmount
        escrow: PublicKey
        escrowEndsAt: Date
        escrowStartedAt: Date
        latestPower: TokenAmount
        owner: PublicKey
        tokenAccount: PublicKey
    }[]
}

interface VotersListRaw {
    count: number
    name: string
    updatedAt: string
    totalVotes: string
    voters: {
        amount: string
        escrow: string
        escrowEndsAt: string
        escrowStartedAt: string
        latestPower: string
        owner: string
        tokenAccount: string
    }[]
}

export interface GovernorVoters {
    count: number
    name: string
    updatedAt: string
    totalVotes: number
    voters: {
        amount: string
        escrow: PublicKey
        escrowEndsAt: Date
        escrowStartedAt: Date
        latestPower: string
        owner: PublicKey
        tokenAccount: PublicKey
    }[]
}

/**
 * Builds the URL for fetching voters data
 */
function buildVotersURL(governorKey: string): string {
    return `${TRIBECA_VOTERS_BASE_URL}/${governorKey}.json`
}

/**
 * Hook to fetch governor voters data
 */
function useGovernorVoters(governorKey: PublicKey) {
    return useQuery<GovernorVoters | null>({
        queryKey: ['governorVoters', governorKey.toString()],
        queryFn: async () => {
            const data = await fetchNullableWithSessionCache<VotersListRaw>(
                buildVotersURL(governorKey.toString())
            )

            if (!data) {
                return null
            }

            return {
                ...data,
                totalVotes: parseFloat(data.totalVotes),
                voters: data.voters.map((rawVoter) => ({
                    ...rawVoter,
                    escrow: new PublicKey(rawVoter.escrow),
                    owner: new PublicKey(rawVoter.owner),
                    tokenAccount: new PublicKey(rawVoter.tokenAccount),
                    escrowEndsAt: new Date(rawVoter.escrowEndsAt),
                    escrowStartedAt: new Date(rawVoter.escrowStartedAt),
                })),
            }
        },
    })
}

/**
 * Hook to fetch voters list with token amounts
 */
function useVotersList() {
    const { governor, veToken, govToken } = useGovernor()

    return useQuery<VotersList>({
        queryKey: ['votersOfDAO', governor.toString()],
        queryFn: async () => {
            invariant(veToken && govToken, 'veToken and govToken are required')
            const data = await fetch(buildVotersURL(governor.toString()))
                .then((res) => res.json()) as VotersListRaw

            return {
                ...data,
                voters: data.voters.map((rawVoter) => ({
                    ...rawVoter,
                    amount: TokenAmount.parse(govToken, rawVoter.amount),
                    latestPower: TokenAmount.parse(veToken, rawVoter.latestPower),
                    escrow: new PublicKey(rawVoter.escrow),
                    owner: new PublicKey(rawVoter.owner),
                    tokenAccount: new PublicKey(rawVoter.tokenAccount),
                    escrowEndsAt: new Date(rawVoter.escrowEndsAt),
                    escrowStartedAt: new Date(rawVoter.escrowStartedAt),
                })),
            }
        },
        enabled: !!veToken,
    })
}

export { useGovernorVoters, useVotersList }