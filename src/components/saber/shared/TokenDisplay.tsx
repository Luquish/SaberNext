'use client'

import { FC } from 'react'
import Image from 'next/image'

const VAULT_POINTS_MINT = 'vPtS4ywrbEuufwPkBXsCYkeTBfpzCd6hF52p8kJGt9b'
const VAULT_POINTS_LOGO = 'https://thevault.finance/images/tokens/vpts.svg'

interface TokenDisplayProps {
    name?: string
    mint: string
    className?: string
}

export const TokenDisplay: FC<TokenDisplayProps> = ({ 
    name,
    mint,
    className, 
}) => {
    if (mint === VAULT_POINTS_MINT) {
        return <span className={className}>Vault points</span>
    }

    if (name) {
        return <span className={className}>{name}</span>
    }

    return <span className={className}>{mint.slice(0, 4)}...</span>
}

interface TokenLogoProps {
    img?: string
    mint: string
    className?: string
    size?: number
}

export const TokenLogo: FC<TokenLogoProps> = ({ 
    img,
    mint,
    className = '',
    size = 24,
}) => {
    // Handle Vault Points token
    if (mint === VAULT_POINTS_MINT) {
        return (
            <Image
                src={VAULT_POINTS_LOGO}
                alt="Vault points"
                width={size}
                height={size}
                className={`rounded-full ${className}`}
            />
        )
    }

    // Handle tokens with images
    if (img) {
        return (
            <Image
                src={img}
                alt="Token logo"
                width={size}
                height={size}
                className={`rounded-full ${className}`}
            />
        )
    }

    // Fallback for tokens without images
    return (
        <div 
            className={`
                flex items-center justify-center
                bg-gray-800 rounded-full
                text-xs font-mono
                ${className}
            `}
            style={{ width: size, height: size }}
        >
            {mint.slice(0, 4)}
        </div>
    )
}