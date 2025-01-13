'use client'

import { startCase } from 'lodash-es'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { MobileNav } from './MobileNav'
import { Nav } from './Nav'
import Rook from './Rook.svg'
import { SettingsModal } from './SettingsModal'
import { WalletDropdown } from './WalletDropdown'

interface Props {
    placeholder: boolean
}

export function Header({ placeholder }: Props) {
    const params = useParams()
    const dao = params?.dao

    const { network } = useEnvironment()
    
    return (
        <div className='bg-warmGray-900 w-screen'>
            <div className='flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl'>
                <div className='flex items-center gap-4 z-20 md:z-auto'>
                    <Link href={`/gov/${dao ?? ''}`}>
                        <div className='text-white hover:text-primary hover:-rotate-3 transition-all'>
                            <Rook />
                        </div>
                    </Link>
                    <div className='hidden md:block'>
                        {!placeholder && <Nav />}
                    </div>
                </div>
                <div className='flex items-center'>
                    {network !== 'mainnet-beta' && (
                        <span className='text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto'>
                            {startCase(network)}
                        </span>
                    )}
                    <WalletDropdown />

                    {!placeholder && (
                        <>
                            <MobileNav className='ml-4 md:hidden' />
                            <SettingsModal className='ml-4' />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}