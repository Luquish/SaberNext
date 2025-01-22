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
    active?: boolean
}

export function Button({ 
    children, 
    type = 'primary',
    size = 'large',
    className,
    disabled,
    active,
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
                type === 'primary' && 'bg-saber hover:bg-saber/20',
                type === 'secondary' && !active && 'bg-slate-900 hover:bg-slate-800',
                type === 'danger' && 'bg-red-800 hover:bg-red-700',
                // Estado activo
                active && 'bg-white !text-black border border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.25)]',
                // Tamaños
                size === 'small' && 'py-1 px-3 text-xs',
                size === 'large' && 'py-2 px-3 text-sm',
                size === 'full' && 'py-2 px-3 text-sm w-full',
                // Estados
                disabled && 'opacity-50 cursor-not-allowed hover:bg-saber',
                !disabled && !active && 'cursor-pointer',
                active && 'cursor-default pointer-events-none',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}