'use client'

interface ContentLoaderProps {
    className?: string
}

/**
 * Animated loading placeholder component
 */
function ContentLoader({ className }: ContentLoaderProps) {
    return (
        <div 
            className={`h-4 w-12 animate-pulse rounded bg-white bg-opacity-10 ${className || ''}`}
        />
    )
}

export { ContentLoader }