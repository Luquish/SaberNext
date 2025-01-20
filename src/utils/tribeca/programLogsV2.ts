'use client'

import type { InstructionLogEntry } from '@saberhq/solana-contrib'

export type LogStyle = 'muted' | 'info' | 'success' | 'warning'

/**
 * Returns the appropriate color for a log entry type
 */
export function styleColor(style: InstructionLogEntry['type']): string {
    switch (style) {
    case 'text':
        return 'text-white'
    case 'cpi':
    case 'system':
        return 'text-blue-400'
    case 'success':
        return 'text-saber-500'
    case 'programError':
    case 'runtimeError':
        return 'text-accent-500'
    default:
        return 'text-white' // Fallback color
    }
}