'use client'

import { Fraction } from '@saberhq/token-utils'
import type BN from 'bn.js'

interface Props {
    value: BN | number
    max: BN | number
    barColor: string
    className?: string
}

/**
 * Progress meter component that handles both BN and number values
 */
function Meter({
    value,
    max,
    barColor,
    className,
}: Props) {
    const width = typeof value === 'number' && typeof max === 'number'
        ? value / max
        : new Fraction(value, max).asNumber

    return (
        <div className={`flex-grow bg-warmGray-700 h-1 rounded ${className || ''}`}>
            <div
                style={{
                    width: `${Math.min(width, 1) * 100}%`,
                    backgroundColor: barColor,
                }}
                className="bg-primary h-1 rounded transition-all"
            />
        </div>
    )
}

export { Meter }