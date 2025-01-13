'use client'

import { isPublicKey } from '@saberhq/solana-contrib'
import { Percent, Price, Token, TokenAmount } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import BN, { isBN } from 'bn.js'
import { startCase } from 'lodash-es'
import React from 'react'

import { formatPercent } from '@/utils/tribeca/format'
import { fmtObject } from '../../utils/tribeca/makeDiff'
import { NamedAddressLink } from './NamedAddressLink'
import { TableCardBody } from './card/TableCardBody'
import { LoadingSpinner } from './LoadingSpinner'
import { AddressWithContext } from './program/AddressWithContext'
import { TokenAmountDisplay } from './TokenAmountDisplay'

interface DisplayValueProps {
    className?: string
    loading?: boolean
    value: unknown
    valueStyles?: React.CSSProperties
}

/**
 * Component to display various types of values with appropriate formatting
 */
function DisplayValue({
    loading = true,
    value,
}: DisplayValueProps) {
    if (value === undefined) {
        return loading ? <LoadingSpinner /> : <span>(undefined)</span>
    }

    if (value === null) {
        return <span>(null)</span>
    }

    if (value instanceof Date) {
        return <span>{value.getTime() === 0 ? 'never' : value.toLocaleString()}</span>
    }

    if (isBN(value)) {
        return <span>{value.bitLength() > 53 ? value.toString() : value.toNumber().toLocaleString()}</span>
    }

    if (isPublicKey(value)) {
        return <AddressWithContext pubkey={new PublicKey(value)} />
    }

    if (value instanceof TokenAmount) {
        return <TokenAmountDisplay showIcon amount={value} />
    }

    if (value instanceof Token) {
        return (
            <NamedAddressLink address={value.mintAccount} showCopy>
                {value.name}
            </NamedAddressLink>
        )
    }

    if (value instanceof Price) {
        return (
            <span>
                {value.asFraction.toFixed(3)} {value.quoteCurrency.symbol} /{' '}
                {value.baseCurrency.symbol}
            </span>
        )
    }

    if (value instanceof Percent || 
        (typeof value === 'object' && (value as Record<string, unknown>)?.isPercent)) {
        return <span>{formatPercent(value as Percent)}</span>
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return <span>{value.toLocaleString()}</span>
    }

    if (BN.isBN(value)) {
        return <span>{value.toString()}</span>
    }

    if (React.isValidElement(value as object | null | undefined)) {
        return value as React.ReactNode
    }

    if (Array.isArray(value)) {
        return (
            <div className="flex flex-col gap-1">
                {value.map((v: unknown, i) => (
                    <DisplayValue key={i} value={v} />
                ))}
            </div>
        )
    }

    if (typeof value === 'object') {
        return (
            <TableCardBody>
                {Object.entries(value).map(([k, v]) => (
                    <tr key={k}>
                        <td>{startCase(k)}</td>
                        <td>
                            <div className="flex flex-col items-end">
                                <DisplayValue value={v as unknown} />
                            </div>
                        </td>
                    </tr>
                ))}
            </TableCardBody>
        )
    }

    return (
        <pre>
            <code>{fmtObject(value as Record<string, unknown>)}</code>
        </pre>
    )
}

export { DisplayValue }