'use client'

/**
 * Badge component with primary background and centered content
 */
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span 
            className={`bg-saber text-white px-2 py-0.5 rounded-md flex items-center justify-center ${className || ''}`}
        >
            {children}
        </span>
    )
}

export { Badge }