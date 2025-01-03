'use client'

import clsx from 'clsx'

interface Tab {
    name: string
    current: boolean
}

interface TabButtonProps {
    tab: Tab
    isFirst: boolean
    isLast: boolean
    isSingle: boolean
    onClick: () => void
}

function TabButton({ 
    tab, 
    isFirst,
    isLast,
    isSingle,
    onClick,
    ...props
}: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={clsx(
                'group relative min-w-0 flex-1',
                'overflow-hidden py-2 px-2',
                'text-center text-sm font-medium',
                'focus:z-10 bg-gradient-to-t',
                'text-white',
                tab.current 
                    ? 'from-saber-dark to-saber-light' 
                    : 'from-slate-900 to-slate-800 hover:from-saber-dark/50 hover:to-saber-light/50',
                isFirst && 'rounded-tl-lg',
                isLast && 'rounded-tr-lg',
                isSingle && 'cursor-default'
            )}
            aria-current={tab.current ? 'page' : undefined}
            {...props}
        >
            <span>{tab.name}</span>
            <span
                aria-hidden="true"
                className={clsx(
                    'absolute inset-x-0 bottom-0 h-0.5',
                    tab.current ? 'bg-saber-light' : 'bg-gray-800'
                )}
            />
        </button>
    )
}

interface TabsProps {
    tabs: Tab[]
    setSelectedTab: (tab: string) => void
    className?: string
}

export function Tabs({ 
    tabs,
    setSelectedTab,
    className,
}: TabsProps) {
    return (
        <div className={className}>
            <nav 
                className="isolate flex divide-x divide-gray-700 rounded-lg shadow" 
                aria-label="Tabs"
                role="tablist"
            >
                {tabs.map((tab, index) => (
                    <TabButton
                        key={tab.name}
                        tab={tab}
                        isFirst={index === 0}
                        isLast={index === tabs.length - 1}
                        isSingle={tabs.length === 1}
                        onClick={() => setSelectedTab(tab.name)}
                    />
                ))}
            </nav>
        </div>
    )
}

export default Tabs
