'use client'

import type {
    IFormatUint,
    Percent,
    Token,
    TokenAmount,
} from '@saberhq/token-utils'

import { formatDisplayWithSoftLimit, formatPercent } from '@/utils/tribeca/format'
import { TokenIcon } from './TokenIcon'

export interface Props extends IFormatUint {
    token?: Token
    amount: TokenAmount
    isMonoNumber?: boolean
    showIcon?: boolean
    percent?: Percent
    className?: string
    showSymbol?: boolean
    suffix?: string
    exact?: boolean
}

/**
 * Component to display token amounts with formatting options
 */
function TokenAmountDisplay({
    amount,
    token = amount.token,
    isMonoNumber = false,
    showIcon = false,
    showSymbol = true,
    percent,
    className,
    suffix = '',
    exact = false,
}: Props) {
    return (
        <div className={`flex items-center ${className || ''}`}>
            {showIcon && (
                <TokenIcon
                    className="mr-1"
                    token={token}
                />
            )}
            <span className={isMonoNumber ? 'font-mono' : undefined}>
                {exact
                    ? amount.toExact({ groupSeparator: ',' })
                    : formatDisplayWithSoftLimit(amount.asNumber, token.decimals)}
            </span>

            {showSymbol && (
                <span>
                    {'\u00A0'}
                    {token.symbol}
                </span>
            )}
            {percent && (
                <span className="ml-1">
                    ({formatPercent(percent)})
                </span>
            )}
            {suffix && <span>{suffix}</span>}
        </div>
    )
}

export { TokenAmountDisplay }