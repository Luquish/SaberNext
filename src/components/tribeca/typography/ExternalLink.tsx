'use client'

import type { AnchorHTMLAttributes, ClassAttributes } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import Link from 'next/link'

type Props = ClassAttributes<HTMLAnchorElement> &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        noIcon?: boolean
        icon?: React.ReactNode
    }

export function ExternalLink({
    children,
    noIcon = false,
    icon,
    ...anchorProps
}: Props) {
    return (
        <a
            className='text-sm text-primary hover:text-white transition-colors'
            target='_blank'
            rel='noreferrer'
            {...anchorProps}
        >
            {children}
            {!noIcon &&
                (icon ?? (
                    <FaExternalLinkAlt 
                        className='ml-2 inline align-baseline h-[0.8em] w-[0.8em]' 
                    />
                ))}
        </a>
    )
}

export function InternalLink({ className, ...props }: { className?: string } & Parameters<typeof Link>[0]) {
    return (
        <Link
            className={`text-sm flex items-center gap-2 text-primary hover:text-white transition-colors ${className || ''}`}
            {...props}
        />
    )
}