'use client'

import { ProgramError } from '@project-serum/anchor'
import type { InstructionLogEntry, PublicKey } from '@saberhq/solana-contrib'
import { useMemo } from 'react'

import { useIDL } from '@/hooks/tribeca/useIDLs'
import { styleColor } from '@/utils/tribeca/programLogsV2'
import { buildPrefix } from '.'

interface Props {
    entry: InstructionLogEntry & { type: 'programError' }
    currentProgramId?: PublicKey
}

/**
 * Renders a program error log entry with parsed error details if available
 */
function RenderedProgramError({ entry, currentProgramId }: Props) {
    const { data: idl } = useIDL(currentProgramId)

    const errorParsed = useMemo(() => {
        try {
            const errorMap = new Map<number, string>()
            
            idl?.idl?.errors?.forEach((err) => {
                errorMap.set(
                    err.code, 
                    `${err.name}${err.msg ? `: ${err.msg}` : ''}`
                )
            })

            return ProgramError.parse(entry.text, errorMap)
        } catch (e) {
            return null
        }
    }, [entry, idl])

    return (
        <span>
            <span>{buildPrefix(entry.depth)}</span>
            <span className={styleColor(entry.type)}>
                Program returned error: {entry.text}
                {errorParsed && (
                    <span className="text-slate-400"> # {errorParsed.message}</span>
                )}
            </span>
        </span>
    )
}

export { RenderedProgramError }