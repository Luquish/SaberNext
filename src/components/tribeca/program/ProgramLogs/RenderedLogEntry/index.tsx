'use client'

import type { InstructionLogEntry, PublicKey } from '@saberhq/solana-contrib'
import { formatLogEntry } from '@saberhq/solana-contrib'

import { styleColor } from '@/utils/tribeca/programLogsV2'
import { RenderedCPI } from './RenderedCPI'
import { RenderedProgramError } from './RenderedProgramError'

interface Props {
    entry: InstructionLogEntry
    currentProgramId?: PublicKey
}

/**
 * Builds the prefix string for log entries based on depth
 */
function buildPrefix(depth: number): string {
    const indentation = new Array(depth - 1).fill('\u00A0\u00A0').join('')
    return indentation + '> '
}

/**
 * Component that renders a program log entry with proper formatting
 */
function RenderedLogEntry({ entry, currentProgramId }: Props) {
    // Handle CPI entries
    if (entry.type === 'cpi') {
        return <RenderedCPI entry={entry} />
    }

    // Handle program errors
    if (entry.type === 'programError') {
        return (
            <RenderedProgramError 
                entry={entry} 
                currentProgramId={currentProgramId} 
            />
        )
    }

    // Handle standard log entries
    return (
        <span>
            <span>{buildPrefix(entry.depth)}</span>
            <span style={{ color: styleColor(entry.type) }}>
                {formatLogEntry(entry)}
            </span>
        </span>
    )
}

export { RenderedLogEntry, buildPrefix }