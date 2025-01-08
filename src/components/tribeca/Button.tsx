'use client'

import React, { useState } from 'react'

import { handleException } from '@/utils/tribeca/error'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'

type Variant =
    | 'outline'
    | 'outline-danger'
    | 'default'
    | 'danger'
    | 'primary'
    | 'secondary'
    | 'muted'

type Size = 'sm' | 'md' | undefined

interface AdditionalButtonProps {
    size?: Size
    variant?: Variant
    icon?: boolean
}

interface ButtonProps extends Omit<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >,
    'onClick'
>, AdditionalButtonProps {
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void | Promise<void>
    children?: React.ReactNode
}

const getVariantClasses = (variant: Variant = 'default'): string => {
    const variants = {
        default: 'border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:border-gray-300 transition-colors',
        outline: 'border hover:border-gray-200 transition-colors text-gray-800 dark:text-white',
        primary: 'text-black bg-primary shadow border border-primary-600',
        secondary: 'text-white bg-accent shadow border border-accent-600',
        muted: 'text-gray-200 bg-gray-700 hover:bg-gray-500',
        danger: 'bg-red-500 text-black font-bold',
        'outline-danger': 'border dark:text-white hover:dark:text-red-500 hover:dark:border-red-500',
    }
    return variants[variant]
}

const getSizeClasses = (size: Size = 'sm'): string => {
    const sizes = {
        sm: 'py-1.5 px-2 h-8 text-sm font-medium',
        md: 'py-3 px-5 text-base rounded',
        undefined: 'py-1.5 px-2 h-8 text-sm font-medium',
    }
    return sizes[size]
}

/**
 * Button component with multiple variants and sizes
 */
function Button({
    children,
    disabled,
    className,
    onClick,
    variant = 'default',
    size = 'sm',
    icon,
    ...props
}: ButtonProps) {
    const [loading, setLoading] = useState(false)

    const baseClasses = 'flex flex-row items-center justify-center leading-normal rounded-sm text-sm font-semibold transform active:scale-98 text-gray-800 hover:bg-opacity-90 transition-all'
    const disabledClasses = 'disabled:bg-gray-400 disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed'
    const iconClasses = icon ? 'rounded-full w-7 h-7 p-0' : ''
    
    const buttonClasses = `
        ${baseClasses}
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${disabledClasses}
        ${iconClasses}
        ${className || ''}
    `.trim()

    return (
        <button
            {...props}
            onClick={onClick ? async (e) => {
                setLoading(true)
                try {
                    await onClick(e)
                } catch (e) {
                    handleException(e, { source: 'button' })
                }
                setLoading(false)
            } : undefined}
            disabled={disabled || loading}
            className={buttonClasses}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    {children}
                    <LoadingSpinner className="ml-2 mb-0.5" />
                </div>
            ) : (
                children
            )}
        </button>
    )
}

export { Button }
export type { ButtonProps }