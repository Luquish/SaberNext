'use client'

import type { TransactionInstruction } from '@solana/web3.js'

import { useParsedInstruction } from '@/hooks/tribeca/useParsedInstruction'

interface Props {
    ix: TransactionInstruction
}

/**
 * Renders a proposal instruction with its parsed title
 */
function ProposalIX({ ix }: Props) {
    const parsedIX = useParsedInstruction(ix)
    
    return (
        <div className="
            bg-gray bg-opacity-20 
            border border-warmGray-800 
            px-4 py-2 
            rounded 
            text-sm font-semibold
        ">
            {parsedIX.title}
        </div>
    )
}

export { ProposalIX }