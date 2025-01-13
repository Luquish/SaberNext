'use client'

import { useEffect } from 'react'

/**
 * Hook to manage window title with cleanup
 * @param title - The title to set for the window
 */
function useWindowTitle(title: string): void {
    useEffect(() => {
        const prevTitle = document.title
        document.title = title
        
        return () => {
            document.title = prevTitle
        }
    }, [title])
}

export { useWindowTitle }