'use client'

import { FC } from 'react'
import { HiExternalLink } from 'react-icons/hi'
import { useReadLocalStorage } from 'usehooks-ts'
import { Explorer } from '@/types/saber'
import { explorers } from '@/config/saber/constants'

interface TXProps {
    tx: string
    className?: string
    showFull?: boolean
}

export const TX: FC<TXProps> = ({ 
    tx, 
    className = '',
    showFull = false, 
}) => {
    const preferredExplorer = useReadLocalStorage<Explorer>('preferredExplorer')
    const explorer = explorers[preferredExplorer || Explorer.SOLSCAN]

    const displayTx = showFull 
        ? tx 
        : `${tx.substring(0, 4)}...${tx.substring(tx.length - 4)}`

    return (
        <a
            href={`${explorer.tx}${tx}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                font-mono text-saber-light font-bold
                flex items-center gap-1
                hover:text-saber-light/80 transition-colors
                ${className}
            `}
            title={`View transaction on ${explorer.name}: ${tx}`}
        >
            {displayTx}
            <HiExternalLink 
                className="w-4 h-4" 
                aria-hidden="true"
            />
            <span className="sr-only">
                View transaction on {explorer.name}
            </span>
        </a>
    )
}

export default TX
