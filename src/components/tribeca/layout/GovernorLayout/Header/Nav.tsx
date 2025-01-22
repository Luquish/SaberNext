'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useGovernor } from '@/hooks/tribeca/useGovernor'

const TITLES = {
    'overview': 'Governance Overview',
    'proposals': 'Governance Proposals',
    'locker': 'Governance Locker',
    'gauges': 'Governance Gauges',
    'details': 'Governance Parameters',
} as const

export const NAV_LINKS = [
    {
        title: 'Overview',
        href: '',
        exact: true,
    },
    {
        title: 'Proposals',
        href: '/proposals',
    },
    {
        title: 'Locker',
        href: '/locker',
    },
]

export function useNavLinks() {
    const { manifest } = useGovernor()
    return useMemo(
        () => [
            ...NAV_LINKS,
            ...(manifest?.quarry?.gauge && !manifest?.quarry?.gauge.hidden
                ? [{ title: 'Gauges', href: '/gauges' }]
                : []),
            ...(manifest?.saves
                ? [
                    {
                        title: 'SAVEs',
                        href: '/saves',
                    },
                ]
                : []),
            ...(manifest?.nftLockerGauges
                ? manifest.nftLockerGauges.map((nftGauge) => ({
                    title: `${nftGauge.label} Gauges`,
                    href: `/nftgauges/${nftGauge.label.toLowerCase()}`,
                }))
                : []),
            {
                title: 'Parameters',
                href: '/details',
            },
        ],
        [manifest]
    )
}

interface Props {
    className?: string
}

function Nav({ className }: Props) {
    const params = useParams()
    const dao = params?.dao as string
    const pathname = usePathname()
    const navLinks = useNavLinks()
    
    const currentPath = pathname.split('/').pop() || ''
    const pageTitle = TITLES[currentPath as keyof typeof TITLES] || 'Overview'

    return (
        <div className="flex flex-col items-center w-full pt-5 mt-16">
            <h1 className="text-3xl text-white mb-2">
                <span className="bg-gradient-radial from-[#5599FF] via-[#88CCFF] to-[#5599FF] bg-clip-text text-transparent">
                    {pageTitle}
                </span>
            </h1>
            <div className="w-full max-w-7xl mx-auto mt-16">
                <div className="w-full border-b border-coolGray-700 mb-4" />
                <nav className={`inline-flex bg-[#1a1a1a] rounded-lg relative ${className ?? ''}`}>
                    {navLinks.map(({ title, href }) => {
                        const fullPath = `/gov/${dao ?? ''}${href}`
                        const isActive = href === '' 
                            ? pathname === `/gov/${dao}/overview` || pathname === `/gov/${dao}`
                            : pathname === fullPath
                        
                        return (
                            <Link
                                key={href}
                                href={fullPath || `/gov/${dao}/overview`}
                                className={`
                                    px-4 py-2.5 text-sm font-medium transition-all duration-200 relative z-10
                                    ${isActive 
                                ? 'text-white rounded-lg' 
                                : 'text-slate-400 hover:text-white'
                            }
                                `}
                            >
                                {title}
                                {isActive && (
                                    <div 
                                        className="absolute inset-0 rounded-lg bg-saber/20 border border-saber shadow-[0_0_3px_rgba(85,153,255,0.1)] "
                                    />
                                )}
                            </Link>
                        )
                    })}
                </nav>
                <div className="w-full border-b border-coolGray-700 mt-4 mb-10" />
            </div>
        </div>
    )
}

export { Nav }