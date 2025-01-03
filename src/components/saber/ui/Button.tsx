'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'


interface ButtonProps {
    children: ReactNode
    type?: 'primary' | 'secondary' | 'danger'
    size?: 'full' | 'large' | 'small'
    className?: string
    onClick?: () => void
    disabled?: boolean
}

export function Button({ 
    children, 
    type = 'primary',
    size = 'large',
    className,
    disabled,
    onClick,
    ...props
}: ButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                'relative transition-colors rounded-lg',
                'flex items-center justify-center gap-1',
                'text-slate-200',
                // Tipos
                type === 'primary' && 'bg-saber-dark hover:bg-saber-light',
                type === 'secondary' && 'bg-slate-900 hover:bg-slate-800',
                type === 'danger' && 'bg-red-800 hover:bg-red-700',
                // Tamaños
                size === 'small' && 'py-1 px-3 text-xs',
                size === 'large' && 'py-2 px-3 text-sm',
                size === 'full' && 'py-2 px-3 text-sm w-full',
                // Estados
                disabled && 'opacity-50 cursor-not-allowed hover:bg-saber-dark',
                !disabled && 'cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}