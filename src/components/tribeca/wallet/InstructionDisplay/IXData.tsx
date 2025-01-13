'use client'

import { chunks } from '@rockooor/sail'

import type { InstructionParseError } from '@/utils/tribeca/instructions/parseNonAnchorInstruction'
import { Box } from './Box'

interface IXDataProps {
    data: Buffer
    error?: InstructionParseError | null
}

/**
 * Component that displays instruction data and potential parsing errors
 */
function IXData({ data, error }: IXDataProps) {
    return (
        <Box title={`Instruction Data (${data.length} bytes)`}>
            {error && (
                <div className="text-red-500 text-sm mb-2">
                    Error parsing instruction: {error.message}
                </div>
            )}
            {data.length > 0 ? (
                <pre className="whitespace-pre-wrap bg-accent-50 bg-opacity-30 px-3 py-2 border border-accent-100 rounded">
                    <code>
                        {chunks(data.toString('hex').split(''), 2)
                            .map((x) => x.join(''))
                            .join(' ')}
                    </code>
                </pre>
            ) : (
                <span className="text-secondary text-sm">
                    <em>(empty)</em>
                </span>
            )}
        </Box>
    )
}

export type { IXDataProps }
export { IXData }