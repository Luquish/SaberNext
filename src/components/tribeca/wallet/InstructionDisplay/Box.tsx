'use client'

import type { ReactNode } from 'react'

interface BoxProps {
    title: string
    children?: ReactNode
    className?: string
}

/**
 * Box component with title and content sections
 */
function Box({ title, children, className }: BoxProps) {
    return (
        <div className="border dark:border-warmGray-600 rounded text-sm">
            <h2 className="px-6 py-2 font-semibold text-gray-800 dark:text-gray-100">
                {title}
            </h2>
            <div
                className={`px-6 py-2 border-t border-t-gray-150 dark:border-t-warmGray-600 ${className ?? ''}`}
            >
                {children}
            </div>
        </div>
    )
}

export type { BoxProps }
export { Box }