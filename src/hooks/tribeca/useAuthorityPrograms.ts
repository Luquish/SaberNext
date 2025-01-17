'use client'

import { utils } from '@project-serum/anchor'
import { useAccountData } from '@rockooor/sail'
import { u64 } from '@saberhq/token-utils'
import type { AccountInfo } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'

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
    
    const [programData, setProgramData] = useState<{
        data: any[] | undefined
        isLoading: boolean
        isFetched: boolean
        error: Error | null
    }>({
        data: [],
        isLoading: true,
        isFetched: false,
        error: null,
    })

    const [programs, setPrograms] = useState<Array<{
        data: ProgramInfo | null
        isLoading: boolean
        error: Error | null
    }>>([])

    useEffect(() => {
        // EXPERIMENTAL: Timer para forzar isLoading a false después de un tiempo
        // Esto permite que el componente muestre NoPrograms si el fetch tarda demasiado
        // Puedes ajustar el tiempo (5000ms) según necesites
        const loadingTimer = setTimeout(() => {
            setProgramData(prev => ({
                ...prev,
                isLoading: false,
                isFetched: true,
            }))
        }, 5000) // 5 segundos de timeout para isLoading

        if (!address) {
            clearTimeout(loadingTimer) // Limpiamos el timer si no hay address
            setProgramData(prev => ({
                ...prev,
                data: [],
                isLoading: false,
                isFetched: true,
                error: null,
            }))
            setPrograms([])
            return
        }

        const fetchProgramData = async () => {
            try {
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

                clearTimeout(loadingTimer) // Limpiamos el timer si el fetch termina antes
                const processedData = await Promise.all(
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

                setProgramData({
                    data: processedData,
                    isLoading: false,
                    isFetched: true,
                    error: null,
                })
            } catch (error) {
                clearTimeout(loadingTimer) // Limpiamos el timer si hay error
                setProgramData({
                    data: [],
                    isLoading: false,
                    isFetched: true,
                    error: error as Error,
                })
            }
        }

        fetchProgramData()

        // Limpieza del timer si el componente se desmonta
        return () => clearTimeout(loadingTimer)
    }, [address, network])

    // Efecto para programs
    useEffect(() => {
        if (!programData.data) {
            setPrograms([])
            return
        }

        const initialPrograms = programData.data.map(() => ({
            data: null,
            isLoading: true,
            error: null,
        }))
        setPrograms(initialPrograms)

        const fetchPrograms = async () => {
            const results = await Promise.all(
                programData.data.map(async ({
                    pubkey,
                    lamports: programDataLamports,
                    lastDeploySlot,
                    upgradeAuthority,
                }) => {
                    try {
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
                        return {
                            data: account ? {
                                programID: account.pubkey,
                                programData: pubkey,
                                programDataLamports,
                                lastDeploySlot,
                                upgradeAuthority,
                            } : null,
                            isLoading: false,
                            error: null,
                        }
                    } catch (error) {
                        return {
                            data: null,
                            isLoading: false,
                            error: error as Error,
                        }
                    }
                })
            )

            setPrograms(results)
        }

        fetchPrograms()
    }, [programData.data, network])

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
    const [state, setState] = useState<{
        data: ProgramDeployBuffer[] | undefined
        isLoading: boolean
        error: Error | null
    }>({
        data: undefined,
        isLoading: true,
        error: null,
    })

    useEffect(() => {
        if (!address) {
            setState(prev => ({ ...prev, isLoading: false }))
            return
        }

        const fetchBuffers = async () => {
            try {
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

                const buffers = await Promise.all(
                    raw.map(async ({ pubkey, account }): Promise<ProgramDeployBuffer> => {
                        const buffer = await parseProgramDeployBuffer({ pubkey, account })
                        return {
                            ...buffer,
                            bufferAuthority: address,
                        }
                    })
                )

                setState({
                    data: buffers,
                    isLoading: false,
                    error: null,
                })
            } catch (error) {
                setState({
                    data: undefined,
                    isLoading: false,
                    error: error as Error,
                })
            }
        }

        fetchBuffers()
    }, [address, network])

    return state
}

/**
 * Hook to fetch and parse a program deploy buffer
 */
export const useProgramDeployBuffer = (buffer: PublicKey) => {
    const { data: accountData } = useAccountData(buffer)
    const [state, setState] = useState<{
        data: Omit<ProgramDeployBuffer, 'bufferAuthority'> | null | undefined
        isLoading: boolean
        error: Error | null
    }>({
        data: undefined,
        isLoading: true,
        error: null,
    })

    useEffect(() => {
        if (!accountData?.accountInfo) {
            setState(prev => ({ ...prev, isLoading: false }))
            return
        }

        const fetchBuffer = async () => {
            try {
                const result = await parseProgramDeployBuffer({
                    pubkey: buffer,
                    account: accountData.accountInfo,
                })

                setState({
                    data: result,
                    isLoading: false,
                    error: null,
                })
            } catch (error) {
                setState({
                    data: null,
                    isLoading: false,
                    error: error as Error,
                })
            }
        }

        fetchBuffer()
    }, [buffer, accountData])

    return state
}