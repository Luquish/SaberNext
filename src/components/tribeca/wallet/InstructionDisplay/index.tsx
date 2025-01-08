'use client'

import type { RichParsedInstruction } from '@/hooks/tribeca/useParsedInstruction'
import type { ParsedInstruction } from '@/hooks/tribeca/useSmartWallet'
import { AttributeList } from '@/components/tribeca/AttributeList'
import { Box } from './Box'
import { IXAccounts } from './IXAccounts'
import { IXArguments } from './IXArguments'
import { IXData } from './IXData'

interface InstructionDisplayProps {
    instruction: ParsedInstruction
    parsed: RichParsedInstruction
}

/**
 * Component that displays instruction details based on its type
 */
function InstructionDisplay({ instruction, parsed }: InstructionDisplayProps) {
    return (
        <div className="grid gap-4">
            {parsed.data.type === 'raw' && (
                <IXData
                    data={Buffer.from(parsed.data.data)}
                    error={
                        instruction.parsed && 'error' in instruction.parsed
                            ? instruction.parsed.error
                            : null
                    }
                />
            )}
            {parsed.data.type === 'anchor' && (
                <IXArguments args={parsed.data.args} />
            )}
            {parsed.data.type === 'object' && (
                <Box title="Arguments" className="p-0">
                    <AttributeList
                        attributes={parsed.data.args as Record<string, unknown>}
                    />
                </Box>
            )}
            <IXAccounts accounts={parsed.accounts} />
        </div>
    )
}

export type { InstructionDisplayProps }
export { InstructionDisplay }