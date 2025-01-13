'use client'

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

type CommonProps<T> = InputHTMLAttributes<T> & TextareaHTMLAttributes<T>

export interface LabeledInputProps<T extends HTMLElement> extends CommonProps<T> {
    Component: React.FC<CommonProps<T>>
    label?: string
    error?: string
    touched?: boolean
    footer?: React.ReactNode
}

/**
 * Input wrapper component that adds label, error state and footer
 */
function LabeledInput<T extends HTMLElement>({
    id,
    label,
    Component,
    error,
    touched,
    footer,
    className = '',
    ...commonProps
}: LabeledInputProps<T>) {
    return (
        <label 
            className="flex flex-col gap-1" 
            htmlFor={id}
        >
            {label && <span className="text-sm">{label}</span>}
            <Component
                {...commonProps}
                id={id}
                className={`${touched && error ? 'ring-1 ring-red-500' : ''} ${className}`}
            />
            {touched && error && (
                <span className="text-red-500 text-sm">{error}</span>
            )}
            {footer !== undefined && (
                <span className="text-sm">{footer}</span>
            )}
        </label>
    )
}

export type { CommonProps }
export { LabeledInput }