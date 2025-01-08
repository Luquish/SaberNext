'use client'

import { Box } from '@/components/tribeca/wallet/InstructionDisplay/Box'

interface Argument {
    name: string
    type: string
    data: string
}

interface IXArgumentsProps {
    args: Argument[]
}

/**
 * Component that displays instruction arguments in a formatted way
 */
function IXArguments({ args }: IXArgumentsProps) {
    return (
        <Box title={`Arguments (${args.length})`} className="p-0">
            {args.map((arg, i) => (
                <div
                    key={`arg_${i}`}
                    className={`
                        px-6 py-2 flex items-center justify-between 
                        border-t border-t-gray-150 dark:border-t-warmGray-600 gap-4
                        ${arg.type.includes('<') ? 'flex-col items-start gap-2' : ''}
                    `}
                >
                    <div className="flex gap-4 flex-shrink-0">
                        <span className="text-gray-500 font-semibold">
                            {arg.name}
                        </span>
                        <code className="text-gray-500 font-medium font-mono">
                            {arg.type}
                        </code>
                    </div>
                    <div className="text-gray-800 dark:text-white font-medium flex-shrink flex-wrap break-words">
                        {arg.data}
                    </div>
                </div>
            ))}
        </Box>
    )
}

export type { Argument, IXArgumentsProps }
export { IXArguments }