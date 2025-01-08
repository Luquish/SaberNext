'use client'

import { ZERO } from '@quarryprotocol/quarry-sdk'
import type { ParsedAccountInfo } from '@rockooor/sail'
import { u64 } from '@saberhq/token-utils'
import type { PublicKey } from '@solana/web3.js'
import { useQueries, useQuery } from '@tanstack/react-query'
import type { ProposalData, ProposalMetaData } from '@tribecahq/tribeca-sdk'
import {
    findProposalAddress,
    findProposalMetaAddress,
    getProposalState,
    ProposalState,
} from '@tribecahq/tribeca-sdk'
import BN from 'bn.js'
import { useEffect, useMemo } from 'react'
import invariant from 'tiny-invariant'

import {
    useParsedProposal,
    useParsedProposalMeta,
    useParsedProposalMetas,
    useParsedProposals,
    useParsedTXByKey,
    useParsedTXByKeys,
} from '@/utils/tribeca/parsers'
import { useEnvironment } from './useEnvironment'
import { useGovernor } from './useGovernor'

/**
 * Represents the status of a proposal
 */
export class ProposalStatus {
    readonly state: ProposalState
    readonly executionTime: BN

    constructor(proposalState: ProposalState, executedAt: BN | undefined) {
        this.state = proposalState
        this.executionTime = new BN(executedAt ?? '0')
    }

    get executed() {
        return this.state === ProposalState.Queued && this.executionTime.gt(ZERO)
    }
}

export interface ProposalInfo {
    proposalKey: PublicKey
    index: number
    proposalData: ProposalData
    proposalMetaData: ProposalMetaData | null
    status: ProposalStatus
}

/**
 * Builds a ProposalInfo object from raw data
 */
function buildProposalInfo({
    index,
    proposalData,
    proposalMetaData,
    executedAt,
}: {
    index: number
    proposalData: ParsedAccountInfo<ProposalData>
    proposalMetaData: ProposalMetaData | null
    executedAt: BN | undefined
}): ProposalInfo {
    const state = getProposalState({
        proposalData: proposalData.accountInfo.data,
    })

    return {
        proposalKey: proposalData.accountId,
        index,
        proposalData: proposalData.accountInfo.data,
        proposalMetaData,
        status: new ProposalStatus(state, executedAt),
    }
}

/**
 * Hook to fetch data for a specific proposal
 */
function useProposal(index: number) {
    const { network } = useEnvironment()
    const { governor } = useGovernor()
    const id = `000${index}`.slice(-4)

    // Fetch proposal keys
    const proposalKeys = useQuery({
        queryKey: ['proposalKeys', network, governor.toString(), index],
        queryFn: async () => {
            const [proposalKey] = await findProposalAddress(governor, new u64(index))
            const [proposalMetaKey] = await findProposalMetaAddress(proposalKey)
            return { proposalKey, proposalMetaKey }
        },
    })

    // Fetch proposal data
    const { data: proposalData } = useParsedProposal(
        proposalKeys.data?.proposalKey
    )
    const { data: proposalMetaData } = useParsedProposalMeta(
        proposalKeys.data?.proposalMetaKey
    )

    const queued = proposalData?.accountInfo.data.queuedAt.gt(ZERO)
    const { data: txData } = useParsedTXByKey(
        queued ? proposalData?.accountInfo.data.queuedTransaction : null
    )

    const isLoading = (queued && !txData) || !proposalData || proposalMetaData === undefined

    // Fetch proposal info
    const proposalInfoQuery = useQuery({
        queryKey: ['proposalInfo', network, governor.toString(), index],
        queryFn: (): ProposalInfo => {
            invariant(proposalData, 'Proposal data is required')
            return buildProposalInfo({
                index: proposalData.accountInfo.data.index.toNumber(),
                proposalData,
                proposalMetaData: proposalMetaData
                    ? proposalMetaData.accountInfo.data
                    : null,
                executedAt: txData?.accountInfo.data.executedAt,
            })
        },
        enabled: !isLoading,
    })

    const { refetch } = proposalInfoQuery
    const executedAt = txData?.accountInfo.data.executedAt
    const info = isLoading ? null : proposalInfoQuery.data ?? null
    const state = proposalData
        ? getProposalState({
            proposalData: proposalData.accountInfo.data,
        })
        : null

    // Handle refetching
    useEffect(() => {
        if (!isLoading || executedAt?.isZero()) {
            void refetch()
        }
    }, [proposalData, refetch, proposalMetaData, state, isLoading, executedAt])

    // Handle active proposal updates
    useEffect(() => {
        if (!proposalData) {
            return
        }
        if (state === ProposalState.Active) {
            const timeRemaining =
                proposalData.accountInfo.data.votingEndsAt.toNumber() * 1_000 -
                Date.now()
            return clearTimeout(
                setTimeout(() => {
                    void refetch()
                }, timeRemaining + 1)
            )
        }
    }, [proposalData, refetch, state])

    return {
        refetch,
        info,
        id,
        index,
    }
}

/**
 * Hook to fetch data for all proposals
 */
function useProposals() {
    const { network } = useEnvironment()
    const { governor, governorData, proposalCount } = useGovernor()

    const count = typeof proposalCount === 'number' 
        ? proposalCount 
        : proposalCount?.account.proposalCount.toNumber() ?? 0

    // Fetch proposal keys
    const proposalsKeys = useQueries({
        queries: count
            ? Array(count)
                .fill(null)
                .map((_, i) => count - i - 1)
                .map((i) => ({
                    queryKey: ['proposalKeys', network, governor.toString(), i],
                    queryFn: async () => {
                        invariant(governorData, 'Governor data is required')
                        const [proposalKey] = await findProposalAddress(
                            governorData.publicKey,
                            new u64(i)
                        )
                        const [proposalMetaKey] = await findProposalMetaAddress(
                            proposalKey
                        )
                        return { proposalKey, proposalMetaKey }
                    },
                    enabled: !!governorData,
                }))
            : [],
    })

    // Fetch proposals data
    const proposalsData = useParsedProposals(
        useMemo(
            () => proposalsKeys.map((p) => p.data?.proposalKey),
            [proposalsKeys]
        )
    )

    // Fetch proposals metadata
    const proposalsMetaData = useParsedProposalMetas(
        useMemo(
            () => proposalsKeys.map((p) => p.data?.proposalMetaKey),
            [proposalsKeys]
        )
    )

    // Fetch transactions data
    const transactionsData = useParsedTXByKeys(
        useMemo(
            () =>
                proposalsData
                    .filter((p) => p?.accountInfo.data.queuedAt.gt(ZERO))
                    .map((p) => p?.accountInfo.data.queuedTransaction),
            [proposalsData]
        )
    )

    const isLoading =
        !proposalsData.every((p) => p !== undefined) ||
        !proposalsMetaData.every((p) => p !== undefined) ||
        !transactionsData.every((t) => t !== undefined)

    // Return queries for all proposals
    return useQueries({
        queries: count
            ? Array(count)
                .fill(null)
                .map((_, i) => count - i - 1)
                .map((i) => ({
                    queryKey: ['proposalInfo', network, governor.toString(), i],
                    queryFn: (): ProposalInfo | null => {
                        const proposalData = proposalsData.find(
                            (p) => p?.accountInfo.data.index.toNumber() === i
                        )
                        if (!proposalData) {
                            return null
                        }

                        const proposalMetaData = proposalsMetaData.find((p) =>
                            p?.accountInfo.data.proposal.equals(proposalData.accountId)
                        )

                        const transactionData = transactionsData.find((t) =>
                            t
                                ? proposalData.accountInfo.data.queuedTransaction.equals(
                                    t.accountId
                                )
                                : false
                        )

                        return buildProposalInfo({
                            index: proposalData.accountInfo.data.index.toNumber(),
                            proposalData,
                            proposalMetaData: proposalMetaData
                                ? proposalMetaData.accountInfo.data
                                : null,
                            executedAt: transactionData?.accountInfo.data.executedAt,
                        })
                    },
                    enabled: !isLoading,
                }))
            : [],
    })
}

export { useProposal, useProposals }