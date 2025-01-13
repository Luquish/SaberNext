'use client'

import { useState } from 'react'
import { FaGripLines } from 'react-icons/fa'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useNavLinks } from './Nav'

interface Props {
    className?: string
}

export function MobileNav({ className }: Props) {
    const params = useParams()
    const dao = params?.dao as string
    const [showNav, setShowNav] = useState<boolean>(false)
    const navLinks = useNavLinks()
    
    return (
        <div className={className}>
            <div
                className={`
                    fixed left-0 bottom-0 h-[calc(100vh-80px)] w-screen bg-warmGray-900 
                    transition-all duration-500 z-10 flex flex-col
                    ${!showNav ? 'opacity-0 pointer-events-none -translate-y-full' : 'translate-y-0 opacity-100'}
                `}
                style={{
                    transition: !showNav 
                        ? 'transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.3s ease-in'
                        : undefined,
                }}
            >
                <div className='flex flex-grow items-center justify-center'>
                    <div className='flex flex-col items-center font-bold text-base text-white'>
                        {navLinks.map(({ title, href }) => (
                            <Link
                                key={href}
                                href={`/gov/${dao ?? ''}${href}`}
                                className='py-5'
                                onClick={() => {
                                    setShowNav(false)
                                }}
                            >
                                <div>{title}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <button
                className='z-20 relative'
                onClick={() => {
                    setShowNav((prev) => !prev)
                }}
            >
                <FaGripLines />
            </button>
        </div>
    )
}