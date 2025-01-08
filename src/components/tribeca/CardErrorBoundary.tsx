'use client'

import { ErrorBoundary } from '@sentry/react'

import { HelperCard } from './HelperCard'

interface Props {
    children?: React.ReactNode
}

interface ErrorFallbackProps {
    error: Error
    eventId: string
    componentStack: string
}

/**
 * Error boundary component for cards with Sentry integration
 */
function CardErrorBoundary({ children }: Props) {
    const ErrorFallback = ({ error, eventId, componentStack }: ErrorFallbackProps) => (
        <div className="py-7 px-4">
            <HelperCard variant="error">
                <p>An unexpected error occurred: {error.message}.</p>
                <p>
                    Please share the following information to help us debug this
                    issue:
                </p>
                <p>Event ID: {eventId}</p>
                <pre>{componentStack}</pre>
            </HelperCard>
        </div>
    )

    return (
        <ErrorBoundary fallback={ErrorFallback}>
            {children}
        </ErrorBoundary>
    )
}

export { CardErrorBoundary }