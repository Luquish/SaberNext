'use client'

import { Header } from './Header'
import { Nav } from './Header/Nav'

interface Props {
    placeholder?: boolean
    children?: React.ReactNode
}

export function GovernorLayout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header placeholder={false} />
            <Nav />
            <div>
                {children}
            </div>
            <style jsx global>{`
                body.dark {
                    background-color: rgb(41 37 36); /* bg-warmGray-800 */
                }
            `}</style>
        </div>
    )
}