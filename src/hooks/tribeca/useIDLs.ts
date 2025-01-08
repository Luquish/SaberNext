'use client'

import { useConnection } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { useQueries } from '@tanstack/react-query'
import invariant from 'tiny-invariant'
import { Idl } from '@project-serum/anchor'

import { fetchIDL } from '@/utils/tribeca/fetchers'
import { KNOWN_NON_ANCHOR_PROGRAMS } from '@/utils/tribeca/programs'

interface IDLResult {
    programID: PublicKey
    idl: Idl | null
}

/**
 * Hook to fetch multiple IDLs for given program IDs
 */
function useIDLs(idls: (PublicKey | null | undefined)[]) {
    const { connection } = useConnection()

    return useQueries({
        queries: idls.map((pid) => ({
            queryKey: ['idl', pid?.toString()],
            queryFn: async (): Promise<IDLResult> => {
                invariant(pid, 'Program ID is required')

                if (KNOWN_NON_ANCHOR_PROGRAMS.has(pid.toString())) {
                    return { programID: pid, idl: null }
                }

                return {
                    programID: pid,
                    idl: await fetchIDL(connection, pid.toString()),
                }
            },
            enabled: !!pid,
            staleTime: Infinity, // Cache IDLs indefinitely
        })),
    })
}

/**
 * Hook to fetch a single IDL for a given program ID
 */
function useIDL(address: PublicKey | null | undefined) {
    const results = useIDLs([address])
    const ret = results[0]
    invariant(ret, 'IDL query result should exist')
    return ret
}

export { useIDLs, useIDL }