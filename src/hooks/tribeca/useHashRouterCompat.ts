'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Hook to handle hash-based routing compatibility in Next.js
 * Converts hash-based routes (#/path) to regular routes (/path)
 */
export function useHashRouterCompat() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // In Next.js, we need to handle the hash from window.location
        const hash = window.location.hash

        if (hash.startsWith('#/')) {
            const newPath = hash.replace('#', '')
            if (pathname !== newPath) {
                router.replace(newPath)
            }
        }
    }, [pathname, router])
}