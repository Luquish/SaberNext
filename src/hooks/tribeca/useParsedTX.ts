'use client'

import { SuperCoder } from '@saberhq/anchor-contrib'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { startCase } from 'lodash-es'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'

import { parseNonAnchorInstruction } from '@/utils/tribeca/instructions/parseNonAnchorInstruction'
import { useGokiTransactionData } from '@/utils/tribeca/parsers'
import { displayAddress, programLabel } from '@/utils/tribeca/programs'
import { useEnvironment } from './useEnvironment'
import { useIDLs } from './useIDLs'
import type { ParsedInstruction } from './useSmartWallet'
import { useTXAddress } from './useTXAddress'

interface ParsedTXResult {
    tx: any // TODO: Type this properly based on txData structure
    index: number
    instructions: ParsedInstruction[]
}

/**
 * Hook to parse transaction by smart wallet key and index
 */
function useParsedTX(smartWalletKey: PublicKey, index: number) {
    const { data: key } = useTXAddress(smartWalletKey, index)
    return useParsedTXByKey(key)
}

/**
 * Hook to parse transaction by transaction key
 */
function useParsedTXByKey(key: PublicKey | undefined) {
    const { network } = useEnvironment()
    const { data: txData, isLoading: loading } = useGokiTransactionData(key)
    const idls = useIDLs(
        txData?.account.instructions.map((ix) => ix.programId) ?? []
    )

    const query = useQuery({
        queryKey: ['parsedTX', network, key?.toString()],
        queryFn: async (): Promise<ParsedTXResult> => {
            invariant(txData, 'Transaction data is required')

            const instructions: ParsedInstruction[] = txData.account.instructions
                // Convert raw instruction data to Buffer
                .map((rawIx) => ({
                    ...rawIx,
                    data: Buffer.from(rawIx.data),
                }))
                // Parse instruction details
                .map((ix): Omit<ParsedInstruction, 'title'> => {
                    const idl = idls.find((theIDL) =>
                        theIDL.data?.programID.equals(ix.programId)
                    )?.data?.idl
                    const label = programLabel(ix.programId.toString())

                    if (idl) {
                        const superCoder = new SuperCoder(ix.programId, {
                            ...idl,
                            instructions: idl.instructions.concat(idl.state?.methods ?? []),
                        })
                        return {
                            programName: label ?? startCase(idl.name),
                            ix,
                            parsed: { ...superCoder.parseInstruction(ix), anchor: true },
                        }
                    }

                    const parsedNonAnchor = parseNonAnchorInstruction(ix)
                    return { ix, programName: label, parsed: parsedNonAnchor }
                })
                // Add title to each instruction
                .map((ix): ParsedInstruction => ({
                    ...ix,
                    title: `${
                        ix.programName ?? displayAddress(ix.ix.programId.toString())
                    }: ${startCase(
                        (ix.parsed && 'name' in ix.parsed ? ix.parsed.name : null) ??
                            'Unknown Instruction'
                    )}`,
                }))

            return {
                tx: txData,
                index: txData.account.index.toNumber(),
                instructions,
            }
        },
        enabled: !!txData,
    })

    // Refetch when txData changes
    useEffect(() => {
        if (txData && !query.isFetching) {
            void query.refetch()
        }
    }, [txData, query])

    return { 
        ...query, 
        isLoading: query.isLoading || loading,
    }
}

export { useParsedTX, useParsedTXByKey }