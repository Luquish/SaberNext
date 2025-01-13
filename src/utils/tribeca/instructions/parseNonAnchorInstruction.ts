import { extractErrorMessage } from '@rockooor/sail';
import { TOKEN_PROGRAM_ID } from '@saberhq/token-utils';
import type {
    CreateAccountParams,
    SystemInstructionType,
    TransactionInstruction,
    TransferParams,
    WithdrawNonceParams,
} from '@solana/web3.js';
import { SystemInstruction, SystemProgram } from '@solana/web3.js';
import { startCase } from 'lodash-es';
import type { Infer } from 'superstruct';
import { any, string, type } from 'superstruct';

import { PROGRAM_KEYS } from '@/utils/tribeca/constants';
import type { TokenInstructionInner } from '@/utils/tribeca/instructions/token/parsers';
import { parseTokenInstruction } from '@/utils/tribeca/instructions/token/parsers';
import type { TokenInstructionType } from '@/utils/tribeca/instructions/token/types';
import { IX_TITLES } from '@/utils/tribeca/instructions/token/types';
import { BPF_UPGRADEABLE_LOADER_ID } from '@/utils/tribeca/instructions/upgradeable_loader/instructions';
import type { UpgradeableLoaderInstructionType } from '@/utils/tribeca/instructions/upgradeable_loader/parsers';
import { parseUpgradeableLoaderInstruction } from '@/utils/tribeca/instructions/upgradeable_loader/parsers';

// Instruction Types
export interface MemoInstruction {
    program: 'memo'
    text: string
}

export type TokenInstruction<K extends TokenInstructionType = TokenInstructionType> = 
    TokenInstructionInner & {
        program: 'token'
        type: K
    }

export interface UpgradeableLoaderInstruction {
    program: 'upgradeable_loader'
    type: UpgradeableLoaderInstructionType
}

export interface SystemProgramInstruction {
    program: 'system'
    type: SystemInstructionType
    decoded: TransferParams | CreateAccountParams | WithdrawNonceParams | null
}

type ParsedNonAnchorInstructionInner =
    | MemoInstruction
    | TokenInstruction
    | UpgradeableLoaderInstruction
    | SystemProgramInstruction

export type ParsedNonAnchorInstruction<
    T extends ParsedNonAnchorInstructionInner = ParsedNonAnchorInstructionInner
> = T & {
    name: string
    accountLabels?: string[]
}

type IXParser = (ix: TransactionInstruction) => ParsedNonAnchorInstruction

export type ParsedInfo = Infer<typeof ParsedInfo>
export const ParsedInfo = type({
    type: string(),
    info: any(),
})

/**
 * Instruction parsers for different programs
 */
export const PARSERS: Record<string, IXParser> = {
    [PROGRAM_KEYS.MEMO.toString()]: (ix): ParsedNonAnchorInstruction<MemoInstruction> => ({
        text: ix.data.toString('utf-8'),
        name: 'Memo',
        program: 'memo',
    }),

    [TOKEN_PROGRAM_ID.toString()]: (ix): ParsedNonAnchorInstruction<TokenInstruction> => {
        const result = parseTokenInstruction(ix)
        return { ...result, name: IX_TITLES[result.type], program: 'token' }
    },

    [BPF_UPGRADEABLE_LOADER_ID.toString()]: (
        ix
    ): ParsedNonAnchorInstruction<UpgradeableLoaderInstruction> => {
        const result = parseUpgradeableLoaderInstruction(ix)
        return { ...result, program: 'upgradeable_loader' }
    },

    [SystemProgram.programId.toString()]: (
        ix
    ): ParsedNonAnchorInstruction<SystemProgramInstruction> => {
        const ixType = SystemInstruction.decodeInstructionType(ix)
        const decoded = (() => {
            switch (ixType) {
            case 'Transfer':
                return SystemInstruction.decodeTransfer(ix)
            case 'TransferWithSeed':
                return SystemInstruction.decodeTransferWithSeed(ix)
            case 'Create':
                return SystemInstruction.decodeCreateAccount(ix)
            case 'WithdrawNonceAccount':
                return SystemInstruction.decodeNonceWithdraw(ix)
            default:
                return null
            }
        })()

        return {
            type: ixType,
            decoded,
            name: startCase(ixType),
            program: 'system',
        }
    },
}

/**
 * Error class for instruction parsing failures
 */
export class InstructionParseError extends Error {
    constructor(
        readonly ix: TransactionInstruction,
        readonly originalError: unknown
    ) {
        super(extractErrorMessage(originalError) ?? 'unknown')
        this.name = 'InstructionParseError'
        if (originalError instanceof Error) {
            this.stack = originalError.stack
        }
    }
}

/**
 * Parses a non-anchor instruction
 */
export function parseNonAnchorInstruction(
    ix: TransactionInstruction
): ParsedNonAnchorInstruction | { error: InstructionParseError } | null {
    const parser = PARSERS[ix.programId.toString()]
    if (!parser) return null

    try {
        return parser(ix)
    } catch (e) {
        return { error: new InstructionParseError(ix, e) }
    }
}