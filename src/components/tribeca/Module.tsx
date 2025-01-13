'use client'

import { ErrorBoundary } from '@sentry/react'

interface Props {
    className?: string
    children?: React.ReactNode
}

/**
 * Module component with error boundary and consistent styling
 */
function Module({ children, className }: Props) {
    return (
        <div
            className={`px-4 py-6 md:p-12 rounded bg-white w-full shadow-2xl ${className || ''}`}
        >
            <ErrorBoundary
                fallback={
                    <p className="text-red-500">
                        An error occurred while loading this component.
                    </p>
                }
            >
                {children}
            </ErrorBoundary>
        </div>
    )
}

export { Module }