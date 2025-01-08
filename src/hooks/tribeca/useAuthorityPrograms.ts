'use client'

import { utils } from '@project-serum/anchor'
import { useAccountData } from '@rockooor/sail'
import { u64 } from '@saberhq/token-utils'
import type { AccountInfo } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useQueries, useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { generateSHA256BufferHash } from '@/utils/tribeca/crypto'
import { getGPAConnection } from '@/utils/tribeca/gpaConnection'
import { useEnvironment } from './useEnvironment'
import { stripTrailingNullBytes } from '@/hooks/tribeca/deploydao/stripTrailingNullBytes'
import type { VerifiableProgramRelease } from '@/hooks/tribeca/deploydao/types'
import { fetchCanonicalVerifiableBuild } from '@/hooks/tribeca/deploydao/useCanonicalVerifiableBuild'

export const BPF_UPGRADEABLE_LOADER_ID = new PublicKey(
    'BPFLoaderUpgradeab1e11111111111111111111111'
)

// Account data layout constants
const ACCOUNT_TYPE_SIZE = 4
const SLOT_SIZE = 8 // size_of::<u64>()
const OPTION_SIZE = 1
const PUBKEY_LEN = 32

export interface ProgramInfo {
    programID: PublicKey
    programData: PublicKey
    programDataLamports: number
    lastDeploySlot: number
    upgradeAuthority: PublicKey
}

export interface ProgramDeployBuffer {
    pubkey: PublicKey
    lamports: number
    bufferAuthority: PublicKey
    dataLen: number
    executableData: Buffer
    canonicalData: Buffer
    sha256Sum: string
    canonicalSha256Sum: string
    verifiableBuild: VerifiableProgramRelease | null
}

// CHEQUEAR
function toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length)
    const view = new Uint8Array(arrayBuffer)
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i]
    }
    return arrayBuffer
}

/**
 * Parses a program deploy buffer account
 */
export const parseProgramDeployBuffer = async ({
    pubkey,
    account,
}: {
    pubkey: PublicKey
    account: AccountInfo<Buffer>
}): Promise<Omit<ProgramDeployBuffer, 'bufferAuthority'>> => {
    const programDataOffset = ACCOUNT_TYPE_SIZE + OPTION_SIZE + PUBKEY_LEN
    const dataLen = account.data.length - programDataOffset
    const executableData = account.data.slice(programDataOffset)
    const canonicalData = stripTrailingNullBytes(executableData)


    const canonicalSha256Sum = await generateSHA256BufferHash(toArrayBuffer(canonicalData))
    const verifiableBuild = await fetchCanonicalVerifiableBuild(canonicalSha256Sum)

    return {
        pubkey,
        lamports: account.lamports,
        dataLen,
        executableData,
        canonicalData,
        sha256Sum: await generateSHA256BufferHash(toArrayBuffer(executableData)),
        canonicalSha256Sum,
        verifiableBuild,
    }
}

/**
 * Hook to fetch programs for an authority
 */
export const useAuthorityPrograms = (address: PublicKey | null | undefined) => {
    const { network } = useEnvironment()

    const programData = useQuery({
        queryKey: ['programDataForAuthority', network, address?.toString()],
        queryFn: async () => {
            invariant(address, 'address')
            const raw = await getGPAConnection({ network }).getProgramAccounts(
                BPF_UPGRADEABLE_LOADER_ID,
                {
                    dataSlice: {
                        offset: 0,
                        length: ACCOUNT_TYPE_SIZE + SLOT_SIZE + OPTION_SIZE + PUBKEY_LEN,
                    },
                    filters: [
                        {
                            memcmp: {
                                offset: 0,
                                bytes: utils.bytes.bs58.encode(
                                    Buffer.from(new Uint8Array([3, 0, 0, 0]))
                                ),
                            },
                        },
                        {
                            memcmp: {
                                offset: ACCOUNT_TYPE_SIZE + SLOT_SIZE,
                                bytes: utils.bytes.bs58.encode(
                                    Buffer.from(new Uint8Array([1, ...address.toBytes()]))
                                ),
                            },
                        },
                    ],
                }
            )
            return Promise.all(
                raw.map(({ pubkey, account }) => {
                    const slot = u64
                        .fromBuffer(
                            account.data.slice(
                                ACCOUNT_TYPE_SIZE,
                                ACCOUNT_TYPE_SIZE + SLOT_SIZE
                            )
                        )
                        .toNumber()
                    return {
                        pubkey,
                        lastDeploySlot: slot,
                        lamports: account.lamports,
                        upgradeAuthority: address,
                    }
                })
            )
        },
        enabled: !!address,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false,
    })

    const programs = useQueries({
        queries: programData.data?.map(
            ({
                pubkey,
                lamports: programDataLamports,
                lastDeploySlot,
                upgradeAuthority,
            }) => ({
                queryKey: ['programForProgramData', network, pubkey.toString()],
                queryFn: async (): Promise<ProgramInfo | null> => {
                    const raw = await getGPAConnection({ network }).getProgramAccounts(
                        BPF_UPGRADEABLE_LOADER_ID,
                        {
                            filters: [
                                {
                                    memcmp: {
                                        offset: 0,
                                        bytes: utils.bytes.bs58.encode(
                                            Buffer.from(
                                                new Uint8Array([2, 0, 0, 0, ...pubkey.toBytes()])
                                            )
                                        ),
                                    },
                                },
                            ],
                        }
                    )
                    if (raw.length > 1) {
                        throw new Error(
                            `Multiple program accounts found for program data account ${pubkey.toString()}`
                        )
                    }
                    const account = raw[0]
                    if (!account) {
                        return null
                    }
                    return {
                        programID: account.pubkey,
                        programData: pubkey,
                        programDataLamports,
                        lastDeploySlot,
                        upgradeAuthority,
                    }
                },
            })
        ) ?? [],
    })

    return {
        programs,
        programData,
    }
}

/**
 * Hook to fetch buffers for an authority
 */
export const useAuthorityBuffers = (address: PublicKey | null | undefined) => {
    const { network } = useEnvironment()

    return useQuery({
        queryKey: ['programBuffersForAuthority', network, address?.toString()],
        queryFn: async () => {
            invariant(address, 'address')
            const raw = await getGPAConnection({ network }).getProgramAccounts(
                BPF_UPGRADEABLE_LOADER_ID,
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 0,
                                bytes: utils.bytes.bs58.encode(
                                    Buffer.from(
                                        new Uint8Array([1, 0, 0, 0, 1, ...address.toBytes()])
                                    )
                                ),
                            },
                        },
                    ],
                }
            )
            return Promise.all(
                raw.map(async ({ pubkey, account }): Promise<ProgramDeployBuffer> => {
                    const buffer = await parseProgramDeployBuffer({ pubkey, account })
                    return {
                        ...buffer,
                        bufferAuthority: address,
                    }
                })
            )
        },
        enabled: !!address,
        staleTime: 60_000,
    })
}

/**
 * Hook to fetch and parse a program deploy buffer
 */
export const useProgramDeployBuffer = (buffer: PublicKey) => {
    const { data } = useAccountData(buffer)
    return useQuery({
        queryKey: ['programDeployBuffer', data?.accountId.toString()],
        queryFn: async () => {
            if (!data?.accountInfo) {
                return null
            }
            return parseProgramDeployBuffer({
                pubkey: buffer,
                account: data.accountInfo,
            })
        },
    })
}