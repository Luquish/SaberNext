'use client'

import { useEffect, useState } from 'react'

import { BREAKPOINT_SIZES } from '@/theme/tribeca/breakpoints'

interface WindowDimensions {
    width: number
    height: number
    isMobile: boolean
}

/**
 * Gets current window dimensions
 */
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}

/**
 * Hook to track window dimensions and mobile state
 */
function useWindowDimensions(): WindowDimensions {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions)

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return {
        ...windowDimensions,
        isMobile: windowDimensions.width < BREAKPOINT_SIZES[0],
    }
}

export { useWindowDimensions }