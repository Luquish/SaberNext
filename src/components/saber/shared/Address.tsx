'use client'

import { HiExternalLink } from 'react-icons/hi'
import { useReadLocalStorage } from 'usehooks-ts'
import { Explorer } from '@/types/saber'
import { explorers } from '@/config/saber/constants'

interface AddressProps {
    address: string
    className?: string
    showFull?: boolean
}

export function Address({ 
    address, 
    className = '',
    showFull = false, 
}: AddressProps) {
    const preferredExplorer = useReadLocalStorage<Explorer>('preferredExplorer')
    const explorer = explorers[preferredExplorer || Explorer.SOLSCAN]

    const displayAddress = showFull 
        ? address 
        : `${address.substring(0, 4)}...${address.substring(address.length - 4)}`

    return (
        <a
            href={`${explorer.address}${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                font-mono text-saber-light font-bold
                flex items-center gap-1
                hover:text-saber-light/80 transition-colors
                ${className}
            `}
            title={`View on ${explorer.name}: ${address}`}
        >
            {displayAddress}
            <HiExternalLink 
                className="w-4 h-4" 
                aria-hidden="true"
            />
            <span className="sr-only">
                View on {explorer.name}
            </span>
        </a>
    )
}

export default Address