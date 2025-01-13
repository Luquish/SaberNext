'use client'

import type { PublicKey } from '@solana/web3.js'

import { displayAddress, programLabel } from '@/utils/tribeca/programs'
import type { ProgramDetails } from './deploydao/types'
import { useProgramMeta } from './deploydao/useProgramMeta'
import { DEPLOYDAO_BASE_URL } from '@/utils/tribeca/constants'

interface ProgramMeta {
    label: string
}

/**
 * Fetches program metadata from DeployDAO
 */
async function fetchProgramMeta(address: string): Promise<ProgramDetails | null> {
    const response = await fetch(`${DEPLOYDAO_BASE_URL}/programs/${address}.json`)
    
    if (response.status === 404) {
        return null
    }
    
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    
    return response.json() as Promise<ProgramDetails>
}

/**
 * Hook to get a human-readable label for a program
 */
function useProgramLabel(programId: PublicKey | null | undefined): string {
    const { data: meta, isLoading } = useProgramMeta(programId?.toString())

    return meta?.program.label ?? (
        isLoading
            ? programId 
                ? displayAddress(programId.toString())
                : 'Loading...'
            : programId
                ? programLabel(programId.toString()) ?? 
                  `Unknown (${programId.toString()}) Program`
                : 'Unknown Program'
    )
}

export { 
    type ProgramMeta,
    fetchProgramMeta,
    useProgramLabel,
}