'use client'

import { LoadingSpinner } from './LoadingSpinner'

interface Props {
    className?: string
}

/**
 * Full page loading spinner component
 */
function LoadingPage({ className }: Props) {
    return (
        <div className={`flex items-center justify-center ${className || ''}`}>
            <LoadingSpinner className="h-[84px] w-[84px]" />
        </div>
    )
}

export { LoadingPage }