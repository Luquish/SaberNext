'use client'

import type { Token } from '@saberhq/token-utils'
import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import { LoadingSpinner } from '../LoadingSpinner'
import { TokenIcon } from '../TokenIcon'
import { SelectTokenModal } from './SelectTokenModal'

interface TokenSelectorProps {
    className?: string
    tokens: readonly Token[]
    token: Token | null
    isLoading?: boolean
    onSelect?: (token: Token) => void
}

/**
 * Button component for selecting tokens with loading and empty states
 */
function TokenSelector({
    className = '',
    tokens,
    token,
    onSelect,
    isLoading,
}: TokenSelectorProps) {
    const [showSelector, setShowSelector] = useState<boolean>(false)

    return (
        <>
            <button
                className={`
                    relative text-left flex flex-none items-center justify-between
                    appearance-none text-base
                    whitespace-nowrap py-2 px-4 rounded h-full
                    ${!onSelect ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100 active:bg-gray-200'}
                    ${className}
                `}
                disabled={!onSelect}
                onClick={() => setShowSelector(!showSelector)}
            >
                {token ? (
                    <div className="flex items-center gap-3">
                        <TokenIcon size={32} token={token} />
                        <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="leading-none text-secondary">
                                {token.symbol}
                            </div>
                        </div>
                    </div>
                ) : isLoading ? (
                    <div>
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div>Select a token</div>
                )}
                {onSelect && (
                    <div className="text-base flex items-center ml-6">
                        <FiChevronDown />
                    </div>
                )}
            </button>
            {!isLoading && onSelect && (
                <SelectTokenModal
                    tokens={tokens}
                    isOpen={showSelector}
                    onDismiss={() => setShowSelector(false)}
                    onSelect={(token) => {
                        onSelect?.(token)
                        setShowSelector(false)
                    }}
                />
            )}
        </>
    )
}

export type { TokenSelectorProps }
export { TokenSelector }