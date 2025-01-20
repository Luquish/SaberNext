'use client'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'

interface Props {
    slot: number
    className?: string
    children?: React.ReactNode
}

/**
 * Link component for Solana block explorer slots
 */
function SlotLink({
    slot,
    className,
    children,
}: Props) {
    const { network } = useEnvironment()
    const isTribeca = true

    return (
        <a
            className={`
                ${isTribeca ? 'text-white' : 'text-gray-800'}
                hover:text-saber
                ${className || ''}
            `.trim()}
            href={`https://explorer.solana.com/block/${slot}?cluster=${
                network?.toString() ?? ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children ?? slot.toLocaleString()}
        </a>
    )
}

export { SlotLink }