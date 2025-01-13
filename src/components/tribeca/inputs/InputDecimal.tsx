'use client'

import { DetailedHTMLProps, InputHTMLAttributes } from 'react'

interface InputDecimalProps
    extends Omit<
        DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        'onChange'
    > {
    onChange?: (val: string) => void
    integerOnly?: boolean
}

const DIGIT_ONLY = /^(\d)*$/
const DECIMAL_ONLY = /^-?\d*(\.\d*)?$/

/**
 * Input component for decimal numbers with optional integer-only mode
 */
function InputDecimal({
    onChange,
    integerOnly,
    className = '',
    ...rest
}: InputDecimalProps) {
    return (
        <input
            {...rest}
            className={`
                font-mono text-2xl outline-none border rounded px-4 py-2
                disabled:text-gray-300
                placeholder:text-secondary
                ${className}
            `}
            onChange={(e) => {
                const { value } = e.target
                if (integerOnly) {
                    if (
                        value === '' ||
                        (DIGIT_ONLY.test(value) && !Number.isNaN(parseInt(value)))
                    ) {
                        onChange?.(value)
                    }
                    return
                }
                if (
                    (!Number.isNaN(value) && DECIMAL_ONLY.test(value)) ||
                    value === '' ||
                    value === '-'
                ) {
                    onChange?.(value)
                }
            }}
        />
    )
}

export type { InputDecimalProps }
export { InputDecimal }