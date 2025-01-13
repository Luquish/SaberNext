'use client'

import { BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { ImageWithFallback } from './ImageWithFallback'
import { Footer } from './Footer'

interface GovernancePageInnerProps {
    title: React.ReactNode
    header?: React.ReactNode
    right?: React.ReactNode
    preContent?: React.ReactNode
    children?: React.ReactNode
    contentStyles?: React.CSSProperties
    containerStyles?: React.CSSProperties
    hideDAOName?: boolean
    backLink?: {
        label: string
        href: string
    }
}

/**
 * Inner component for governance pages with consistent layout
 */
function GovernancePageInner({
    title,
    header,
    right,
    preContent,
    children,
    contentStyles,
    containerStyles,
    hideDAOName = false,
    backLink,
}: GovernancePageInnerProps) {
    const { daoName, iconURL } = useGovernor()

    const containerClasses = 'max-w-5xl w-full md:w-11/12 mx-auto'

    return (
        <div className="w-full">
            <div className="bg-warmGray-900 pb-24">
                <div className="h-6 mx-auto w-11/12 max-w-7xl mb-4">
                    {!hideDAOName && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                            <ImageWithFallback
                                src={iconURL}
                                size={24}
                                alt={`Icon for ${daoName ?? 'DAO'}`}
                            />
                            <span>{daoName} Governance</span>
                        </div>
                    )}
                </div>
                <div className={`${containerClasses} w-11/12`} style={containerStyles}>
                    <div className="flex flex-col gap-4 md:gap-8 md:flex-row md:min-h-[120px] flex-wrap items-center justify-between w-full">
                        <div className="flex flex-col self-start md:self-center">
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
                            {typeof title === 'string' ? (
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                                    {title}
                                </h1>
                            ) : (
                                title
                            )}
                            {header}
                        </div>
                        {right && <div>{right}</div>}
                    </div>
                    {preContent && <div className="mt-8">{preContent}</div>}
                </div>
            </div>
            <div className={containerClasses} style={containerStyles}>
                <main className="w-full -mt-16 mb-20" style={contentStyles}>
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    )
}

export { GovernancePageInner }