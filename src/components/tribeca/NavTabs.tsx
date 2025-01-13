'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
    options: readonly {
        label: string
        path: string
    }[]
}

/**
 * Navigation tabs component with active state
 */
function NavTabs({ options }: Props) {
    const pathname = usePathname()

    return (
        <div className="p-1 mx-auto flex gap-0.5 grid-flow-col bg-gray-100 rounded-2xl text-sm">
            {options.map(({ label, path }) => {
                const isActive = pathname === path
                
                return (
                    <Link
                        href={path}
                        key={path}
                        className={isActive ? 'selected' : ''}
                    >
                        <button
                            className={`
                                font-sans font-semibold px-4 py-2 rounded-2xl w-[120px] 
                                grid justify-items-center text-gray-700
                                hover:bg-gray-800 hover:bg-opacity-20
                                selected:bg-gray-900 selected:text-white selected:shadow
                            `}
                        >
                            <span>{label}</span>
                        </button>
                    </Link>
                )
            })}
        </div>
    )
}

export { NavTabs }