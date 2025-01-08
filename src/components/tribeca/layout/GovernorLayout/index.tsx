'use client'

import { Header } from './Header'

interface Props {
    placeholder?: boolean
    children?: React.ReactNode
}

export function GovernorLayout({
    children,
    placeholder = false,
}: Props) {
    return (
        <div>
            <Header placeholder={placeholder} />
            <style jsx global>{`
                body.dark {
                    background-color: rgb(41 37 36); /* bg-warmGray-800 */
                }
            `}</style>
            <div className='flex w-screen'>
                <div className='flex-grow h-full overflow-y-scroll'>
                    {children}
                </div>
            </div>
        </div>
    )
}