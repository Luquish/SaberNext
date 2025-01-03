import { useEffect, useState } from 'react'

/**
 * Hook that provides a real-time feed of claimable amounts.
 * 
 * @warning This causes frequent re-renders. Use with caution and avoid placing high in component tree.
 * 
 * @param getter Function that returns the current claimable amount
 * @returns Current claimable amount or null
 */
export function useClaimableAmounts(
    getter: () => number | null
): number | null {
    const [amount, setAmount] = useState<number | null>(null)
    
    useEffect(() => {
        let isActive = true
        
        const updateAmount = () => {
            const currentAmount = getter()
            
            if (currentAmount !== null) {
                setAmount(currentAmount)
            }
            
            if (isActive) {
                requestAnimationFrame(updateAmount)
            }
        }

        requestAnimationFrame(updateAmount)

        return () => {
            isActive = false
        }
    }, [getter])

    return amount
}