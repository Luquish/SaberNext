'use client'

import { findSubaccountInfoAddress } from '@gokiprotocol/client'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { useSubaccountInfoData } from '@/utils/tribeca/parsers'

/**
 * Hook to fetch and return subaccount info data for a given key
 * @param key - The public key to fetch subaccount info for
 */
function useSubaccountInfo(key: PublicKey | null | undefined) {
    const { data: subaccountInfoKey } = useQuery({
        queryKey: ['subaccountInfoKey', key?.toString()],
        queryFn: async (): Promise<PublicKey> => {
            invariant(key)
            const [sub] = await findSubaccountInfoAddress(key)
            return sub
        },
        enabled: !!key,
    })

    return useSubaccountInfoData(subaccountInfoKey)
}

export { useSubaccountInfo }