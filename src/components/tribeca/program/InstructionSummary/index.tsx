'use client'

import { TOKEN_PROGRAM_ID } from '@saberhq/token-utils'
import type { ProposalInstruction } from '@tribecahq/tribeca-sdk'

import { useParsedProposalInstruction } from '@/hooks/tribeca/useParsedInstruction'
import { BPF_UPGRADEABLE_LOADER_ID } from '@/hooks/tribeca/useAuthorityPrograms'
import type { TokenInstructionInner } from '@/utils/tribeca/instructions/token/parsers'
import type { UpgradeableLoaderInstructionData } from '@/utils/tribeca/instructions/upgradeable_loader/parsers'
import { UpgradeProgramInstruction } from './bpf_upgradeable/UpgradeProgramInstruction'
import { TokenTransferInstruction } from './token/TokenTransferInstruction'

interface Props {
    instruction: ProposalInstruction
}

/**
 * Component that renders a human readable summary of an instruction.
 * This can render different components based on the instruction type.
 */
function InstructionSummary({ instruction }: Props) {
    const ix = useParsedProposalInstruction(instruction)

    // Handle BPF Upgradeable Loader instructions
    if (ix.programID.equals(BPF_UPGRADEABLE_LOADER_ID) && ix.data.type === 'object') {
        const result = ix.data.args as UpgradeableLoaderInstructionData
        if (result.type === 'upgrade') {
            return <UpgradeProgramInstruction data={ix} />
        }
    }

    // Handle Token Program instructions
    if (ix.programID.equals(TOKEN_PROGRAM_ID) && ix.data?.type === 'object') {
        const result = ix.data.args as TokenInstructionInner
        if (result.type === 'transfer' && result.data) {
            return <TokenTransferInstruction transfer={result.data} />
        }
    }

    // Fallback to showing instruction title
    return <>{ix.title}</>
}

export { InstructionSummary }