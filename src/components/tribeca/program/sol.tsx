import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import type BN from 'bn.js'

/**
 * Converts lamports to SOL
 * @param lamports - Amount in lamports (number or BN)
 * @returns Amount in SOL as a number
 */
function lamportsToSol(lamports: number | BN): number {
    if (typeof lamports === 'number') {
        return Math.abs(lamports) / LAMPORTS_PER_SOL
    }

    const signMultiplier = lamports.isNeg() ? -1 : 1
    const absLamports = lamports.abs()
    const lamportsString = absLamports.toString(10).padStart(10, '0')
    const splitIndex = lamportsString.length - 9
    const solString = `${lamportsString.slice(0, splitIndex)}.${lamportsString.slice(splitIndex)}`
    
    return signMultiplier * parseFloat(solString)
}

/**
 * Converts lamports to a formatted SOL string
 * @param lamports - Amount in lamports (number or BN)
 * @param maximumFractionDigits - Maximum number of decimal places to show
 * @returns Formatted SOL amount as string
 */
function lamportsToSolString(
    lamports: number | BN,
    maximumFractionDigits = 9
): string {
    const sol = lamportsToSol(lamports)
    return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(sol)
}

export { lamportsToSol, lamportsToSolString }