'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useGovernor } from '@/hooks/tribeca/useGovernor'

interface TabGroup {
    title: string
    path: string
    tabs: readonly {
        path: string
        label: string
    }[]
}

/**
 * Navigation component for DAO management tabs
 */
function TabNav() {
    const { path: rootPath, meta } = useGovernor()

    const unfilteredGroups: (TabGroup | boolean)[] = [
        {
            title: 'General',
            path: '/',
            tabs: [
                {
                    path: '/rewarders',
                    label: 'Rewarders',
                },
                {
                    path: '/gauges',
                    label: 'Gauges',
                },
                {
                    path: '/executive-council',
                    label: 'Executive Council',
                },
                {
                    path: '/config',
                    label: 'Config',
                },
            ],
        },
        meta?.slug === 'sbr' && {
            title: 'Saber',
            path: '/saber',
            tabs: [
                {
                    path: '/saber/mint-proxy',
                    label: 'Mint Proxy',
                },
                {
                    path: '/saber/redeemer',
                    label: 'Redeemer',
                },
            ],
        },
    ]
    const groups = unfilteredGroups.filter(Boolean) as readonly TabGroup[]

    return (
        <div>
            <nav className="flex flex-col gap-2 bg-warmGray-850 px-3 py-2 rounded">
                {groups.map(({ title, path, tabs }) => (
                    <div key={title}>
                        <SidebarNavLink 
                            href={`${rootPath}/manage${path}`} 
                            className="pl-2 mb-0.5"
                        >
                            <h2 className="text-white font-semibold">{title}</h2>
                        </SidebarNavLink>
                        <div className="flex flex-col gap-0.5">
                            {tabs.map(({ path, label }) => (
                                <SidebarNavLink 
                                    href={`${rootPath}/manage${path}`} 
                                    key={path}
                                >
                                    <span>{label}</span>
                                </SidebarNavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    )
}

interface SidebarNavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
    children: React.ReactNode
}

function SidebarNavLink({ className = '', ...props }: SidebarNavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === props.href

    return (
        <Link
            className={`
                text-warmGray-400 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer 
                hover:bg-warmGray-600 hover:text-white
                ${isActive ? 'bg-warmGray-700 text-white' : ''}
                ${className}
            `}
            {...props}
        />
    )
}

export { TabNav }