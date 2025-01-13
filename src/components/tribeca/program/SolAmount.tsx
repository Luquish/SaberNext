'use client'

import { lamportsToSolString } from './sol'

interface SolAmountProps {
    lamports: number
}

const SYMBOL = '◎'

/**
 * Component that displays a SOL amount with symbol
 */
function SolAmount({ lamports }: SolAmountProps) {
    return (
        <span>
            {SYMBOL}
            {lamportsToSolString(lamports)}
        </span>
    )
}

export type { SolAmountProps }
export { SolAmount }