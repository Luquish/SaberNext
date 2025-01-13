'use client'

import type { AccountParser } from '@rockooor/sail'
import { useAccountData, useParsedAccountData } from '@rockooor/sail'
import { u64 } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { stripTrailingNullBytes } from './stripTrailingNullBytes'

interface ProgramDataInfo {
    data: Buffer
    upgradeAuthority: PublicKey
    lastDeployedSlot: u64
}

/**
 * Parser for program data accounts
 */
const programDataParser: AccountParser<ProgramDataInfo> = (info) => {
    const lastDeployedSlot = u64.fromBuffer(
        info.accountInfo.data.slice(4, 4 + 8)
    )
    const upgradeAuthority = new PublicKey(
        info.accountInfo.data.slice(4 + 8 + 1, 4 + 8 + 1 + 32)
    )
    const data = info.accountInfo.data.slice(4 + 8 + 1 + 32)
    
    return {
        data,
        lastDeployedSlot,
        upgradeAuthority,
    }
}

/**
 * Hook to fetch and parse program data
 */
export function useProgramData(programID: PublicKey) {
    // Fetch program account
    const { data: program } = useAccountData(programID)

    // Extract program data address
    const programDataAddress = useMemo(() => {
        if (!program) {
            return program
        }
        const data = program.accountInfo.data
        const programDataAddress = data.slice(4, 32 + 4)
        return new PublicKey(programDataAddress)
    }, [program])

    // Fetch and parse program data account
    const { data: programData } = useParsedAccountData(
        programDataAddress as PublicKey,
        programDataParser
    )

    // Process canonical data by stripping trailing nulls
    const canonicalData = useMemo(() => {
        if (!programData) {
            return programData
        }
        const data = programData.accountInfo.data.data
        return stripTrailingNullBytes(data)
    }, [programData])

    return {
        programData,
        canonicalData,
    }
}