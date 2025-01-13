'use client'

import { ErrorBoundary } from '@sentry/react'

interface Props {
    children: React.ReactNode | React.ReactNode[]
}

export function PageLayout({ children }: Props) {
    return (
        <div className='flex flex-col items-center mt-6 md:mt-12 w-full'>
            <ErrorBoundary
                fallback={
                    <p className='text-red-500'>
                        An error occurred while loading this page.
                    </p>
                }
            >
                {children}
            </ErrorBoundary>
        </div>
    )
}