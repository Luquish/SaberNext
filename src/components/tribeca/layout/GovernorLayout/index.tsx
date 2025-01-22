'use client'

import { Header } from './Header'
import { Nav } from './Header/Nav'

interface Props {
    placeholder?: boolean
    children?: React.ReactNode
}

export function GovernorLayout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <Header placeholder={false} />
            <Nav />
            <div className="w-full">
                {children}
            </div>
            <style jsx global>{`
                body.dark {
                    background-color: rgb(41 37 36); /* bg-warmGray-800 */
                }
                
                body {
                    width: 100%;
                    min-width: 100%;
                }
            `}</style>
        </div>
    )
}