'use client'

import type { EntryData } from '@cardinal/namespaces'
import {
    ENTRY_SEED,
    NAMESPACE_SEED,
    NAMESPACES_PROGRAM_ID,
} from '@cardinal/namespaces'
import { utils } from '@project-serum/anchor'
import type { AccountParser } from '@rockooor/sail'
import { useParsedAccountData, usePubkey } from '@rockooor/sail'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'

import { NamespaceCoder } from './useAddressName'

/**
 * Parser for Cardinal name entry accounts
 */
const decodeName: AccountParser<EntryData> = (account) => 
    NamespaceCoder.accounts.decode<EntryData>(
        'entry',
        account.accountInfo.data
    )

/**
 * Hook to resolve a Cardinal name to a Solana address
 * Supports both Twitter handles (@username) and domain names (name.domain)
 */
export const useCardinalResolvedAddress = (
    name: string
): PublicKey | null | undefined => {
    const pubkey = usePubkey(name)
    
    // Find the Cardinal entry address
    const { data: address } = useQuery({
        queryKey: ['cardinalAddress', name],
        queryFn: async () => {
            // Parse namespace and entry from name
            const [namespace, entry] = name.startsWith('@')
                ? ['twitter', name.slice(1)]
                : name.split('.').reverse()

            if (!namespace || !entry) {
                return null
            }

            // Find the namespace PDA
            const [namespaceId] = await PublicKey.findProgramAddress(
                [
                    utils.bytes.utf8.encode(NAMESPACE_SEED),
                    utils.bytes.utf8.encode(namespace),
                ],
                NAMESPACES_PROGRAM_ID
            )

            // Find the entry PDA
            const [entryId] = await PublicKey.findProgramAddress(
                [
                    utils.bytes.utf8.encode(ENTRY_SEED),
                    namespaceId.toBytes(),
                    utils.bytes.utf8.encode(entry),
                ],
                NAMESPACES_PROGRAM_ID
            )

            return entryId
        },
    })

    // Get and parse the entry account data
    const { data: entry } = useParsedAccountData(address, decodeName)

    // Return the resolved address or fallback to direct pubkey parsing
    return (entry?.accountInfo.data.data as PublicKey | undefined) ?? pubkey
}