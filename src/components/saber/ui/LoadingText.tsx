'use client'

interface LoadingTextProps {
    className?: string
    height?: number | string
}

export function LoadingText({ 
    className = '',
    height = '1.25rem', // 20px = 5 * 4 (tailwind h-5)
}: LoadingTextProps) {
    return (
        <div 
            className={`
                bg-black animate-pulse rounded
                ${className}
            `}
            style={{ height }}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default LoadingText