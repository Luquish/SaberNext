'use client'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { shortenAddress } from '@/utils/tribeca/utils'
import { ExternalLink } from './typography/ExternalLink'

interface TXLinkProps {
    txSig: string
    className?: string
    children?: React.ReactNode
    full?: boolean
}

/**
 * Link component for Solana transaction signatures
 */
function TXLink({
    txSig,
    className,
    children,
    full,
}: TXLinkProps) {
    const { network } = useEnvironment()
    
    return (
        <ExternalLink
            className={`font-mono ${className || ''}`}
            href={`https://explorer.solana.com/tx/${txSig}?cluster=${
                network?.toString() ?? ''
            }`}
        >
            {children ?? (full ? txSig : shortenAddress(txSig))}
        </ExternalLink>
    )
}

export { TXLink }