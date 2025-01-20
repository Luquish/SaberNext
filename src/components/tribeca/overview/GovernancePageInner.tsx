'use client'

import { BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'

interface GovernancePageInnerProps {
    title?: React.ReactNode
    header?: React.ReactNode
    right?: React.ReactNode
    preContent?: React.ReactNode
    children?: React.ReactNode
    contentStyles?: React.CSSProperties
    containerStyles?: React.CSSProperties
    backLink?: {
        label: string
        href: string
    }
}

function GovernancePageInner({
    children,
    contentStyles,
    backLink,
}: GovernancePageInnerProps) {
    return (
        <div className="w-full">
            {backLink && (
                <Link
                    href={backLink.href}
                    className="flex items-center gap-2 uppercase font-bold mb-7 hover:text-white"
                >
                    <BsArrowLeft className="w-5 h-5" />
                    <span className="leading-none text-sm tracking-tighter">
                        {backLink.label}
                    </span>
                </Link>
            )}
            <main style={contentStyles}>
                {children}
            </main>
        </div>
    )
}

export { GovernancePageInner }