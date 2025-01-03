'use client'

import { type PropsWithChildren } from 'react'
import { DappProvider } from './DappProvider'

/**
 * Root provider component that wraps the application with all necessary providers
 * @param props.children - Child components to be wrapped
 */
export function Providers({ children }: PropsWithChildren) {
    return (
        <DappProvider>
            {children}
        </DappProvider>
    )
}

// Re-export DappProvider for direct imports if needed
export * from './DappProvider' 