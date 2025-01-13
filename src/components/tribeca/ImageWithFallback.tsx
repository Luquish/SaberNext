'use client'

import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
> {
    src?: string
    size?: number
    className?: string
    alt: string
}

/**
 * Image component with fallback placeholder and error handling
 */
function ImageWithFallback({
    className,
    src,
    size = 28,
    alt,
    ...imageProps
}: Props) {
    const [invalid, setInvalid] = useState(false)

    useEffect(() => {
        setInvalid(false)
    }, [src])

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
            {invalid || !src ? (
                <div style={placeholderStyle} />
            ) : (
                <Image
                    {...imageProps}
                    className="h-full w-full"
                    width={size}
                    height={size}
                    src={src}
                    onError={() => setInvalid(true)}
                    alt={alt}
                />
            )}
        </div>
    )
}

export { ImageWithFallback }