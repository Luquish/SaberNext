'use client'

import { useAccountData, useTokens } from '@rockooor/sail'
import {
    deserializeAccount,
    getATAAddress,
    RAW_SOL,
    TOKEN_PROGRAM_ID,
    TokenAmount,
} from '@saberhq/token-utils'
import { useConnection } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import { useEnvironment } from './useEnvironment'
import { useProvider } from './useProvider'

export interface TokenAccountWithInfo {
    account: PublicKey
    balance: TokenAmount
    isATA: boolean
}

/**
 * Fetches the token accounts of the provided address
 */
function useTokenAccounts(address: PublicKey | null | undefined) {
    const { connection } = useConnection()
    const { network } = useEnvironment()
    const nativeBalance = useAccountData(address)

    // Fetch raw token accounts
    const tokenAccountsRaw = useQuery({
        queryKey: ['tokenAccountsRaw', network, address?.toString()],
        queryFn: async () => {
            invariant(address, 'Address is required')
            const raw = await connection.getTokenAccountsByOwner(address, {
                programId: TOKEN_PROGRAM_ID,
            })

            return Promise.all(
                raw.value.map(async ({ pubkey, account }) => {
                    const parsed = deserializeAccount(account.data)
                    const ataAddress = await getATAAddress({
                        mint: parsed.mint,
                        owner: parsed.owner,
                    })
                    return {
                        account: pubkey,
                        mint: parsed.mint,
                        balance: parsed.amount,
                        isATA: ataAddress.equals(pubkey),
                    }
                })
            )
        },
        enabled: !!address,
    })

    // Get token info
    const tokens = useTokens(
        useMemo(
            () => tokenAccountsRaw.data?.map((ta) => ta.mint) ?? [],
            [tokenAccountsRaw.data]
        )
    )

    // Combine native and token balances
    return useQuery({
        queryKey: ['tokenAccounts', network, address?.toString()],
        queryFn: (): TokenAccountWithInfo[] => {
            invariant(address, 'Address is required')

            // Handle SOL balance
            const sol =
                nativeBalance.data &&
                nativeBalance.data.accountInfo.owner.equals(SystemProgram.programId)
                    ? {
                        account: nativeBalance.data.accountId,
                        balance: new TokenAmount(
                            RAW_SOL[network],
                            nativeBalance.data.accountInfo.lamports
                        ),
                        isATA: false,
                    }
                    : null

            // Handle token balances
            const result = tokenAccountsRaw.data?.map(
                ({ mint, balance, ...taRest }) => {
                    const token = tokens.find(
                        (token) =>
                            token.data?.mintAccount.equals(mint) &&
                            token.data?.network === network
                    )
                    if (!token?.data) {
                        return null
                    }
                    return {
                        ...taRest,
                        balance: new TokenAmount(token.data, balance),
                    }
                }
            )

            return [
                ...(sol ? [sol] : []),
                ...(result?.filter((r): r is TokenAccountWithInfo => !!r) ?? []),
            ]
        },
        enabled:
            !nativeBalance.loading &&
            nativeBalance.data !== undefined &&
            !!address &&
            tokens.every((t) => t !== undefined) &&
            tokenAccountsRaw.isFetched,
    })
}

/**
 * Fetches the token accounts of the currently connected user
 */
function useUserTokenAccounts() {
    const { providerMut } = useProvider()
    return useTokenAccounts(providerMut ? providerMut.wallet.publicKey : null)
}

export { useTokenAccounts, useUserTokenAccounts }