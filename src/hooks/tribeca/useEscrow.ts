'use client'

import { TokenAmount } from '@saberhq/token-utils'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { findEscrowAddress, VoteEscrow } from '@tribecahq/tribeca-sdk'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'

import { useSDK } from '../../contexts/tribeca/sdk'
import { useEscrowData, useLockerData } from '@/utils/tribeca/parsers'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { useGovernor } from './useGovernor'

/**
 * Hook to fetch locker data from governor
 */
export const useLocker = () => {
    const { governorData } = useGovernor()
    const lockerKey = governorData?.account.electorate ?? null
    return useLockerData(lockerKey)
}

/**
 * Hook to fetch and manage escrow data for an owner
 */
export const useEscrow = (owner?: PublicKey) => {
    const { tribecaMut } = useSDK()
    const { network } = useEnvironment()
    const wallet = useAnchorWallet()
    const { governorData, governor, veToken, govToken } = useGovernor()
    const lockerKey = governorData?.account.electorate ?? null

    // Get escrow key
    const { data: escrowKey } = useQuery({
        queryKey: ['escrowKey', network, lockerKey?.toString(), owner?.toString()],
        queryFn: async () => {
            invariant(lockerKey && owner, 'Locker key and owner required')
            const [escrowKey] = await findEscrowAddress(lockerKey, owner)
            return escrowKey
        },
        enabled: !!(lockerKey && owner),
    })

    // Get escrow data
    const { data: escrow, isLoading: isEscrowLoading } = useEscrowData(escrowKey)

    // Load escrow details
    const canLoadEscrow = !!(governorData && lockerKey && owner && tribecaMut && escrow)
    const result = useQuery({
        queryKey: ['escrow', escrow?.publicKey.toString()],
        queryFn: async () => {
            invariant(lockerKey && owner && tribecaMut && escrow, 'Required data missing')
            const escrowW = new VoteEscrow(
                tribecaMut,
                lockerKey,
                governor,
                escrow.publicKey,
                owner
            )
            return {
                escrow: escrow.account,
                escrowW,
                calculateVotingPower: await escrowW.makeCalculateVotingPower(),
            }
        },
        enabled: canLoadEscrow,
    })

    // Refetch on dependencies change
    const { refetch } = result
    useEffect(() => {
        if (canLoadEscrow) {
            void refetch()
        }
    }, [canLoadEscrow, escrow, refetch])

    // Calculate token balances
    const veBalance = veToken && result.data
        ? new TokenAmount(
            veToken,
            result.data.calculateVotingPower(new Date().getTime() / 1_000)
        )
        : null

    const govTokensLocked = wallet && govToken
        ? new TokenAmount(govToken, result.data?.escrow.amount ?? 0)
        : null

    return {
        ...result,
        isEscrowLoading,
        veBalance,
        govTokensLocked,
        escrow: escrow === null ? null : result.data,
        escrowKey,
    }
}

/**
 * Hook to fetch current user's escrow
 */
export const useUserEscrow = () => {
    const { tribecaMut } = useSDK()
    return useEscrow(tribecaMut?.provider.wallet.publicKey)
}