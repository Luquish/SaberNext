'use client'

import { CgSpinner } from 'react-icons/cg'

interface Props {
    className?: string
}

/**
 * Animated spinning loader component
 */
function LoadingSpinner({ className }: Props) {
    return (
        <CgSpinner 
            className={`animate-spin inline h-[1em] w-[1em] ${className || ''}`}
        />
    )
}

export { LoadingSpinner }