'use client'

import * as BufferLayout from '@solana/buffer-layout'
import type { TransactionInstruction } from '@solana/web3.js'
import { startCase } from 'lodash-es'

/**
 * Supported instruction types for the upgradeable loader
 */
const instructions = [
    'initializeBuffer',
    'write',
    'deployWithMaxDataLen',
    'upgrade',
    'setAuthority',
    'close',
] as const

export type UpgradeableLoaderInstructionType = typeof instructions[number]

/**
 * Account labels for each instruction type
 * @see https://github.com/solana-labs/solana/blob/master/sdk/program/src/loader_upgradeable_instruction.rs
 */
const accountLabels: { [K in UpgradeableLoaderInstructionType]?: string[] } = {
    initializeBuffer: ['Buffer', 'Buffer Authority'],
    write: ['Buffer', 'Buffer Authority'],
    deployWithMaxDataLen: [
        'Payer',
        'Program Data',
        'Program',
        'Buffer',
        'Rent',
        'Clock',
        'Program Authority',
    ],
    upgrade: [
        'Program Data',
        'Program',
        'Buffer',
        'Spill',
        'Rent',
        'Clock',
        'Program Authority',
    ],
    setAuthority: ['Account', 'Authority', 'Next Authority'],
    close: ['Account', 'Spill', 'Authority', 'Program'],
}

export interface UpgradeableLoaderInstructionData {
    name: string
    type: UpgradeableLoaderInstructionType
    accountLabels?: string[]
}

/**
 * Creates instruction data for the upgradeable loader
 */
export function makeUpgradeableLoaderInstructionData(
    type: UpgradeableLoaderInstructionType
): Buffer {
    return Buffer.from([instructions.indexOf(type), 0, 0, 0])
}

/**
 * Parses an upgradeable loader instruction
 */
export function parseUpgradeableLoaderInstruction(
    ix: TransactionInstruction
): UpgradeableLoaderInstructionData {
    const ixLayout = BufferLayout.struct<{ instruction: number }>([
        BufferLayout.u32('instruction'),
    ])
    const { instruction } = ixLayout.decode(ix.data)
    const ixType = instructions[instruction]

    if (!ixType) {
        throw new Error('Invalid instruction type')
    }

    return {
        type: ixType,
        name: startCase(ixType),
        accountLabels: accountLabels[ixType],
    }
}