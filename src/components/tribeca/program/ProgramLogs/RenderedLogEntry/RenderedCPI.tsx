'use client'

import { usePubkey } from '@rockooor/sail'
import type { InstructionLogEntry } from '@saberhq/solana-contrib'

import { useProgramLabel } from '@/hooks/tribeca/useProgramMeta'
import { styleColor } from '@/utils/tribeca/programLogsV2'
import { buildPrefix } from '.'

interface Props {
    entry: InstructionLogEntry & { type: 'cpi' }
}

/**
 * Renders a CPI (Cross-Program Invocation) log entry
 */
function RenderedCPI({ entry }: Props) {
    const programId = usePubkey(entry.programAddress)
    const label = useProgramLabel(programId)

    return (
        <span>
            <span>{buildPrefix(entry.depth)}</span>
            <span className={styleColor(entry.type)}>
                Invoking {label}
            </span>
        </span>
    )
}

export { RenderedCPI }