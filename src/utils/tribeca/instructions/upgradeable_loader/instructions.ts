'use client'

import type { AccountMeta } from '@solana/web3.js'
import {
    PublicKey,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
} from '@solana/web3.js'

import { makeUpgradeableLoaderInstructionData } from './parsers'

export const BPF_UPGRADEABLE_LOADER_ID = new PublicKey(
    'BPFLoaderUpgradeab1e11111111111111111111111'
)

interface Upgrade {
    program: PublicKey
    buffer: PublicKey
    spill: PublicKey
    signer: PublicKey
}

interface SetAuthority {
    account: PublicKey
    authority: PublicKey
    nextAuthority: PublicKey
}

interface Close {
    account: PublicKey
    spill: PublicKey
    authority?: PublicKey
    program?: PublicKey
}

/**
 * Finds the ProgramData address for a program
 */
export function findProgramDataAddress(programID: PublicKey) {
    return PublicKey.findProgramAddress(
        [programID.toBuffer()],
        BPF_UPGRADEABLE_LOADER_ID
    )
}

/**
 * Creates an instruction to upgrade a program
 */
export async function createUpgradeInstruction({
    program,
    buffer,
    spill,
    signer,
}: Upgrade): Promise<TransactionInstruction> {
    const [programData] = await findProgramDataAddress(program)

    return new TransactionInstruction({
        programId: BPF_UPGRADEABLE_LOADER_ID,
        data: makeUpgradeableLoaderInstructionData('upgrade'),
        keys: [
            { pubkey: programData, isSigner: false, isWritable: true },
            { pubkey: program, isSigner: false, isWritable: true },
            { pubkey: buffer, isSigner: false, isWritable: true },
            { pubkey: spill, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
            { pubkey: signer, isSigner: true, isWritable: false },
        ],
    })
}

/**
 * Creates an instruction to set a new program authority
 */
export function createSetAuthorityInstruction({
    account,
    authority,
    nextAuthority,
}: SetAuthority): TransactionInstruction {
    return new TransactionInstruction({
        programId: BPF_UPGRADEABLE_LOADER_ID,
        data: makeUpgradeableLoaderInstructionData('setAuthority'),
        keys: [
            { pubkey: account, isSigner: false, isWritable: true },
            { pubkey: authority, isSigner: true, isWritable: false },
            { pubkey: nextAuthority, isSigner: false, isWritable: false },
        ],
    })
}

/**
 * Creates an instruction to close a program account
 */
export function createCloseInstruction({
    account,
    spill,
    authority,
    program,
}: Close): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: account, isSigner: false, isWritable: true },
        { pubkey: spill, isSigner: false, isWritable: true },
    ]

    if (authority) {
        keys.push({
            pubkey: authority,
            isSigner: true,
            isWritable: false,
        })
        if (program) {
            keys.push({
                pubkey: program,
                isSigner: false,
                isWritable: true,
            })
        }
    }

    return new TransactionInstruction({
        programId: BPF_UPGRADEABLE_LOADER_ID,
        data: makeUpgradeableLoaderInstructionData('close'),
        keys,
    })
}