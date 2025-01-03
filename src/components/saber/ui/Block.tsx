import { ReactNode } from 'react'
import clsx from 'clsx'

interface BlockProps {
    active?: boolean
    children: ReactNode
    className?: string
    hover?: boolean
    noPadding?: boolean
    onClick?: () => void
}

export function Block({ 
    active,
    children,
    className,
    hover,
    noPadding,
    onClick,
}: BlockProps) {
    return (
        <div 
            className={clsx(
                'relative transition-all',
                hover && 'group cursor-pointer'
            )}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
        >
            <div
                className={clsx(
                    'relative z-10 transition-colors',
                    'bg-gray-900 border border-gray-700',
                    'rounded-lg text-gray-200',
                    active && 'bg-saber-darker',
                    hover && 'group-hover:bg-saber-dark/20',
                    !noPadding && 'p-5',
                    className
                )}
            >
                {children}
            </div>
        </div>
    )
}

export default Block
