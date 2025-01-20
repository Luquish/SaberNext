'use client'

import type { Token } from '@saberhq/token-utils'
import { TokenAmount } from '@saberhq/token-utils'

import { theme } from '@/theme/tribeca'
import { TokenAmountDisplay } from '../TokenAmountDisplay'
import { TokenSelector } from '../TokenSelector'
import { InputDecimal } from './InputDecimal'

interface InputTokenAmountProps {
    label: string
    tokens: readonly Token[]
    onTokenSelect?: (token: Token) => void
    token: Token | null
    inputValue: string
    inputOnChange?: (val: string) => void
    inputDisabled?: boolean
    isLoading?: boolean
    className?: string
    currentAmount?: {
        amount?: TokenAmount
        allowSelect?: boolean
        label?: string
    }
}

/**
 * Component for selecting a token and its amount
 */
function InputTokenAmount({
    label,
    tokens,
    onTokenSelect,
    token,
    inputValue,
    inputOnChange,
    inputDisabled = false,
    currentAmount,
    className = '',
    isLoading,
}: InputTokenAmountProps) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{label}</div>
                {token && (
                    <div>
                        {currentAmount ? (
                            <div 
                                className="flex items-center font-normal text-[13px]"
                                style={{ color: theme.colors.text.default }}
                            >
                                <span>{currentAmount.label ?? 'Balance'}:</span>
                                {currentAmount.amount ? (
                                    <span 
                                        className={`
                                            ml-2 text-saber 
                                            ${currentAmount.allowSelect ? 'cursor-pointer hover:underline' : ''}
                                        `}
                                        onClick={
                                            currentAmount.allowSelect
                                                ? () => inputOnChange?.(currentAmount.amount?.toExact() ?? '0')
                                                : undefined
                                        }
                                    >
                                        <TokenAmountDisplay
                                            amount={currentAmount.amount ?? new TokenAmount(token, 0)}
                                            exact
                                        />
                                    </span>
                                ) : (
                                    <span className="ml-2 text-gray-800">--</span>
                                )}
                            </div>
                        ) : (
                            <div />
                        )}
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <TokenSelector
                    className="
                        bg-white border dark:bg-warmGray-800 dark:border-warmGray-600 rounded
                        basis-[200px]
                    "
                    tokens={tokens}
                    isLoading={isLoading}
                    token={token}
                    onSelect={onTokenSelect}
                />
                <InputDecimal
                    className="flex-grow text-right w-1/2 bg-transparent dark:bg-warmGray-800 border-none"
                    placeholder="0.00"
                    disabled={inputDisabled}
                    value={inputValue}
                    onChange={inputOnChange}
                />
            </div>
        </div>
    )
}

export type { InputTokenAmountProps }
export { InputTokenAmount }