'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { useGovernor } from '@/hooks/tribeca/useGovernor'

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
                ? [
                    {
                        title: 'Gauges',
                        href: '/gauges',
                    },
                ]
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

export function Nav({ className }: Props) {
    const params = useParams()
    const dao = params?.dao as string
    const pathname = usePathname()
    const navLinks = useNavLinks()
    
    return (
        <nav className={`flex gap-2 ${className ?? ''}`}>
            {navLinks.map(({ title, href }) => {
                const fullPath = `/gov/${dao ?? ''}${href}`
                const isActive = pathname === fullPath
                
                return (
                    <Link
                        key={href}
                        href={fullPath}
                        className={`
                            px-3 py-1 rounded text-sm font-semibold transition-colors
                            hover:text-white
                            ${isActive ? 'text-white bg-warmGray-800' : ''}
                        `}
                    >
                        <div>{title}</div>
                    </Link>
                )
            })}
        </nav>
    )
}
