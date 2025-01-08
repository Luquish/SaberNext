'use client'

import { startCase } from 'lodash-es'

import { AddressLink } from '@/components/tribeca/AddressLink'
import { InstructionDisplay } from '@/components/tribeca/wallet/InstructionDisplay'
import { useParsedInstruction } from '@/hooks/tribeca/useParsedInstruction'
import type { ParsedInstruction } from '@/hooks/tribeca/useSmartWallet'
import { shortenAddress } from '@/utils/tribeca/utils'

interface Props {
    index: number,
    instruction: ParsedInstruction,
}

/**
 * Component that displays a preview of a single instruction with its details
 */
function InstructionPreview({
    instruction,
    index,
}: Props) {
    const parsed = useParsedInstruction(instruction.ix)
    
    return (
        <div className="grid border dark:border-warmGray-700 rounded">
            <div className="text-sm p-4">
                <h2 className="font-semibold text-gray-800 dark:text-white mb-2">
                    IX #{index + 1}:{' '}
                    {parsed?.title ??
                        startCase(
                            (instruction.parsed && 'name' in instruction.parsed
                                ? instruction.parsed.name
                                : null) ?? 'Unknown',
                        )}
                </h2>
                <p className="text-xs text-gray-500">
                    <span className="font-medium">Program:</span>{' '}
                    <AddressLink
                        className="font-semibold text-secondary"
                        address={instruction.ix.programId}
                    >
                        {instruction.programName} (
                        {shortenAddress(instruction.ix.programId.toString())})
                    </AddressLink>
                </p>
            </div>
            <div className="p-4 border-t dark:border-t-warmGray-600">
                <InstructionDisplay parsed={parsed} instruction={instruction} />
            </div>
        </div>
    )
}

export { InstructionPreview }