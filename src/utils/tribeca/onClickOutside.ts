'use client'

import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

/**
 * Hook that handles clicks outside of a specified element
 * 
 * @param node - Reference to the element to monitor
 * @param handler - Callback function to execute when click occurs outside
 */
export function useOnClickOutside<T extends HTMLElement>(
    node: RefObject<T | undefined>,
    handler: undefined | ((e?: MouseEvent) => void)
): void {
    // Keep handler in ref to avoid unnecessary re-renders
    const handlerRef = useRef<undefined | ((e?: MouseEvent) => void)>(handler)
    
    // Update handler ref when handler changes
    useEffect(() => {
        handlerRef.current = handler
    }, [handler])

    // Add and remove event listener
    useEffect(() => {
        function handleClickOutside(e: MouseEvent): void {
            // Return early if click was inside the element
            if (node.current?.contains(e.target as Node) ?? false) {
                return
            }
            
            // Execute handler if it exists
            handlerRef.current?.(e)
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [node])
}