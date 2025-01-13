'use client'

interface Props {
    children?: React.ReactNode
    className?: string
    variant?: 'primary' | 'muted' | 'error' | 'warn'
}

/**
 * Card component for displaying helper messages with different variants
 */
function HelperCard({
    children,
    variant = 'primary',
    className,
}: Props) {
    const variants = {
        primary: 'border-primary bg-primary bg-opacity-20 text-primary-100',
        error: 'border-red-500 bg-red-500 bg-opacity-20 text-red-100',
        muted: 'border-slate-500 bg-slate-500 bg-opacity-40 text-slate-200',
        warn: 'border-yellow-500 bg-yellow-500 text-yellow-500 bg-opacity-20',
    }

    return (
        <div 
            className={`
                px-4 py-2 rounded border text-sm
                ${variants[variant]}
                ${className || ''}
            `.trim()}
        >
            {children}
        </div>
    )
}

export { HelperCard }