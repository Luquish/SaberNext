'use client'

import { type PropsWithChildren } from 'react'
import { TribecaDappProvider } from '@/providers/tribeca/TribecaDappProvider'

/**
 * Root provider component that wraps the application with all necessary providers
 * @param props.children - Child components to be wrapped
 */
export function TribecaProviders({ children }: PropsWithChildren) {
    return (
        <TribecaDappProvider>
            {children}
        </TribecaDappProvider>
    )
}

// Re-export DappProvider for direct imports if needed
export * from './TribecaDappProvider'