'use client'

import { Percent, Price, Token, TokenAmount } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { startCase } from 'lodash-es'
import React from 'react'
import type { CSSProperties } from 'react'

import { formatPercent } from '@/utils/tribeca/format'
import { NamedAddressLink } from '@/components/tribeca/NamedAddressLink'
import { AddressLink } from '@/components/tribeca/AddressLink'
import { DisplayValue } from '@/components/tribeca/DisplayValue'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { TokenAmountDisplay } from '@/components/tribeca/TokenAmountDisplay'

interface Props {
    className?: string
    loading?: boolean
    attributes: Record<string, unknown>
    rowStyles?: CSSProperties
    labelStyles?: CSSProperties
    valueStyles?: CSSProperties
    transformLabel?: boolean
}

/**
 * Component to display a list of attributes with their values
 */
function AttributeList({
    className,
    loading = true,
    attributes,
    rowStyles,
    labelStyles,
    valueStyles,
    transformLabel = true,
}: Props) {
    return (
        <div className="flex flex-col text-sm" {...(className && { className })}>
            {Object.entries(attributes).map(([label, attribute], i) => (
                <div
                    className={`flex justify-between items-center px-6 py-2 gap-4 ${
                        i !== 0 ? 'border-t dark:border-warmGray-800' : ''
                    }`}
                    key={label}
                    style={rowStyles}
                >
                    <div
                        className="text-secondary dark:text-gray-400 font-semibold"
                        style={labelStyles}
                    >
                        {transformLabel ? startCase(label) : label}
                    </div>
                    <div className="font-medium" style={valueStyles}>
                        {attribute === undefined ? (
                            loading ? (
                                <LoadingSpinner />
                            ) : (
                                '(undefined)'
                            )
                        ) : attribute === null ? (
                            '(null)'
                        ) : attribute instanceof Date ? (
                            attribute.getTime() === 0 ? (
                                'never'
                            ) : (
                                attribute.toLocaleString()
                            )
                        ) : attribute instanceof PublicKey ? (
                            <AddressLink address={attribute} showCopy />
                        ) : typeof attribute === 'object' &&
                          '_bn' in (attribute as Record<string, unknown>) ? (
                                <AddressLink
                                    address={new PublicKey((attribute as PublicKey).toString())}
                                    showCopy
                                />
                            ) : attribute instanceof TokenAmount ? (
                                <TokenAmountDisplay showIcon amount={attribute} />
                            ) : attribute instanceof Token ? (
                                <NamedAddressLink address={attribute.mintAccount} showCopy>
                                    {attribute.name}
                                </NamedAddressLink>
                            ) : attribute instanceof Price ? (
                                <>
                                    {attribute.asFraction.toFixed(3)}{' '}
                                    {attribute.quoteCurrency.symbol} /{' '}
                                    {attribute.baseCurrency.symbol}
                                </>
                            ) : attribute instanceof Percent ||
                                (typeof attribute === 'object' &&
                                (attribute as Record<string, unknown>)?.isPercent) ? (
                                    formatPercent(attribute as Percent)
                                ) : typeof attribute === 'string' ? (
                                    attribute
                                ) : typeof attribute === 'number' ? (
                                    attribute.toLocaleString()
                                ) : typeof attribute === 'boolean' ? (
                                    attribute.toLocaleString()
                                ) : BN.isBN(attribute) ? (
                                    attribute.toString()
                                ) : Array.isArray(attribute) ? (
                                    attribute.length === 0 ? (
                                        '(empty)'
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {(attribute as PublicKey[]).map((at, i) => (
                                                <DisplayValue key={i} value={at} />
                                            ))}
                                        </div>
                                    )
                                ) : Buffer.isBuffer(attribute) ? (
                                    attribute.toString('hex')
                                ) : React.isValidElement(attribute as object | null | undefined) ? (
                                attribute as React.ReactNode
                                ) : (
                                    'unknown'
                                )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { AttributeList }