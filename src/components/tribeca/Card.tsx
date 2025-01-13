'use client'

import Link from 'next/link'
import { CSSProperties, ReactNode } from 'react'

import { CardErrorBoundary } from './CardErrorBoundary'

interface Props {
    className?: string
    title?: ReactNode
    titleStyles?: CSSProperties
    children?: ReactNode
    link?: {
        title: string
        href?: string
    }
    padded?: boolean
    bodyScrollX?: boolean
}

/**
 * Card component with optional title, link and scroll behavior
 */
function Card({
    className,
    title,
    titleStyles,
    children,
    link,
    padded = false,
    bodyScrollX = false,
}: Props) {
    const bodyClasses = [
        padded ? 'px-7 py-4' : '',
        bodyScrollX ? 'overflow-x-auto' : '',
    ].filter(Boolean).join(' ')

    const linkClasses = 'flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800'

    return (
        <div className={`rounded bg-warmGray-850 shadow-xl flex flex-col ${className || ''}`}>
            {title && (
                <div
                    className="h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-warmGray-800"
                    style={titleStyles}
                >
                    {typeof title === 'string' ? <h2>{title}</h2> : title}
                </div>
            )}

            <CardErrorBoundary>
                <div className={bodyClasses}>
                    {children}
                </div>
            </CardErrorBoundary>

            {link && (
                link.href ? (
                    <Link 
                        href={link.href} 
                        className="text-white hover:text-primary"
                    >
                        <div className={linkClasses}>
                            {link.title}
                        </div>
                    </Link>
                ) : (
                    <div className={`${linkClasses} text-warmGray-600 cursor-not-allowed`}>
                        {link.title}
                    </div>
                )
            )}
        </div>
    )
}

export { Card }