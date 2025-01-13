'use client'

import { FaExclamationTriangle } from 'react-icons/fa'

import { MouseoverTooltip } from '@/components/tribeca/MouseoverTooltip'

/**
 * Tooltip component that warns users about insufficient lockup duration
 */
function LockupTooShortTooltip() {
    return (
        <MouseoverTooltip
            text={
                <div className="max-w-sm">
                    <p>
                        Your voting escrow expires before the start of the next epoch.
                        Please extend your lockup to have your gauge vote count.
                    </p>
                </div>
            }
            placement="bottom-start"
        >
            <FaExclamationTriangle 
                className="
                    h-4 
                    cursor-pointer 
                    inline-block 
                    align-middle 
                    mx-3 
                    mb-0.5 
                    text-yellow-500
                "
            />
        </MouseoverTooltip>
    )
}

export { LockupTooShortTooltip }