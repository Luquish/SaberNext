'use client'

import type { ProposalInstruction } from '@tribecahq/tribeca-sdk'

import { InstructionSummary } from '@/components/tribeca/program/InstructionSummary'

interface IXSummaryProps {
    instruction: ProposalInstruction
}

/**
 * Wrapper component for instruction summary display
 */
function IXSummary({ instruction }: IXSummaryProps) {
    return <InstructionSummary instruction={instruction} />
}

export { IXSummary }