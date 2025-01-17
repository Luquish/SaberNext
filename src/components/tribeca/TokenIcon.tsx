'use client'

import type { Token } from '@saberhq/token-utils'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
    token?: Token | null
    size?: number
    className?: string
}

/**
 * Token icon component with fallback placeholder
 */
function TokenIcon({
    className,
    token,
    size = 28,
}: Props) {
    const [invalid, setInvalid] = useState<boolean>(false)

    const wrapperStyle = {
        height: `${size}px`,
        width: `${size}px`,
    }

    const placeholderStyle = {
        height: '100%',
        width: '100%',
        border: '1px dashed #ccc',
        borderRadius: '100%',
    }

    return (
        <div 
            className={`rounded-full overflow-hidden ${className || ''}`}
            style={wrapperStyle}
        >
            {invalid || !token?.icon ? (
                <div style={placeholderStyle} />
            ) : (
                <Image
                    src={token.icon}
                    onError={() => setInvalid(true)}
                    alt={`Icon for token ${token.name}`}
                    width={size}
                    height={size}
                    className="h-full w-full"
                />
            )}
        </div>
    )
}

export { TokenIcon }