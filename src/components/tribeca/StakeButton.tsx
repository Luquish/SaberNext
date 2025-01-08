'use client'

import { ButtonHTMLAttributes } from 'react'

interface StakeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Button component for staking actions with green highlight
 */
function StakeButton({ className = '', ...props }: StakeButtonProps) {
    return (
        <button
            className={`
                w-12 py-1 rounded-xl text-2xl font-medium 
                transform active:scale-95 
                bg-green-500 bg-opacity-10 
                text-green-500 
                hover:bg-opacity-20 
                transition-all duration-200
                ${className}
            `}
            {...props}
        />
    )
}

export { StakeButton }