'use client'

import { startCase } from 'lodash-es'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { MobileNav } from './MobileNav'
// import { SettingsModal } from './SettingsModal'
// import { WalletDropdown } from './WalletDropdown'

interface Props {
    placeholder: boolean
}

export function Header({ placeholder }: Props) {
    const params = useParams()
    const dao = params?.dao
    const { network } = useEnvironment()
    
    return (
        <div>
            <div className='flex items-center gap-4'>
                <Link href={`/gov/${dao ?? ''}`}></Link>
            </div>
            <div className='flex items-center'>
                {network !== 'mainnet-beta' && (
                    <span className='text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4'>
                        {startCase(network)}
                    </span>
                )}
                {/* <WalletDropdown /> */}

                {!placeholder && (
                    <>
                        <MobileNav className='ml-4 md:hidden' />
                        {/* <SettingsModal className='ml-4' /> */}
                    </>
                )}
            </div>
        </div>
    )
}