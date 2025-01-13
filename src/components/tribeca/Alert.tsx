'use client'

import {
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfoCircle,
} from 'react-icons/fa'
import type { ReactNode } from 'react'

const COLORS = {
    warning: '#ffdc00',
    danger: '#ff0033',
    info: 'rgb(var(--color-primary))', // blue-400 en Tailwind por defecto
} as const

interface Props {
    className?: string
    children?: ReactNode
    type?: keyof typeof COLORS
}

export function Alert({
    className,
    children,
    type = 'warning',
}: Props) {
    return (
        <div 
            className={`
                bg-warmGray-800 rounded border-t-4 text-gray-300
                grid gap-6 p-6
                [grid-template-columns:24px_1fr]
                [&>h2]:text-base [&>h2]:leading-normal [&>h2]:mb-2 [&>h2]:font-semibold [&>h2]:text-white
                [&>svg]:h-6 [&>svg]:w-6
                ${className || ''}
            `}
            style={{
                borderTopColor: COLORS[type],
                '--icon-color': COLORS[type],
            } as React.CSSProperties}
        >
            {type === 'info' && <FaInfoCircle className='text-[var(--icon-color)]' />}
            {type === 'warning' && <FaExclamationTriangle className='mt-1 text-[var(--icon-color)]' />}
            {type === 'danger' && <FaExclamationCircle className='mt-1 text-[var(--icon-color)]' />}
            <div>{children}</div>
        </div>
    )
}
