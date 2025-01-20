'use client'

import { startCase } from 'lodash-es'
import Link from 'next/link'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import TribecaIcon from '@/components/common/svgs/tribeca/favicon.svg'
import TribecaLogo from '@/components/common/svgs/tribeca/logo.svg'
import { WalletDropdown } from '@/components/tribeca/layout/GovernorLayout/Header/WalletDropdown'
import { MoreInfo } from './MoreInfo'

export function Header() {
    const { network } = useEnvironment()
    
    return (
        <div className='relative flex items-center justify-between py-4 md:py-12'>
            <div className='z-50 flex items-center'>
                <div className='flex items-center'>
                    <Link
                        href='/'
                        className='hidden md:block h-6 w-36 hover:-rotate-3 transition-all'
                    >
                        <TribecaLogo className='text-saber-800 hover:text-saber dark:text-saber dark:hover:text-white h-full w-full transition-colors' />
                    </Link>
                    <Link 
                        href='/' 
                        className='md:hidden h-10 hover:-rotate-3 transition-all'
                    >
                        <TribecaIcon className='text-saber-800 hover:text-saber dark:text-saber dark:hover:text-white h-full w-full transition-colors' />
                    </Link>
                </div>
            </div>

            <div className='flex justify-end items-center z-20 gap-4'>
                {network !== 'mainnet-beta' && (
                    <span className='bg-accent px-3 py-0.5 text-xs rounded text-white font-medium'>
                        {startCase(network)}
                    </span>
                )}
                <WalletDropdown />
                <MoreInfo />
            </div>
        </div>
    )
}