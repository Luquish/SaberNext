'use client'

import { DEFAULT_NETWORK_CONFIG_MAP } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import copyToClipboard from 'copy-to-clipboard'
import { FaCopy, FaExternalLinkAlt } from 'react-icons/fa'

import { notify } from '@/utils/tribeca/notifications'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { Button } from '@/components/tribeca/Button'
import { Profile } from '@/components/tribeca/Profile'
import { MouseoverTooltip } from '@/components/tribeca/MouseoverTooltip'

interface Props {
    close?: () => void
}

export function AccountPopover({ close }: Props) {
    const { network } = useEnvironment()
    const { publicKey } = useWallet()
    
    if (!publicKey) {
        return null
    }

    return (
        <div className='w-screen max-w-[378px]'>
            <div className='w-11/12 md:w-full bg-white rounded-lg border dark:bg-warmGray-850 dark:border-warmGray-800'>
                <div className='flex items-center justify-between p-7 border-b dark:border-warmGray-800'>
                    <div className='grid gap-2 text-base'>
                        <div className='flex items-center'>
                            <Profile address={publicKey} />
                        </div>
                        <span className='text-secondary'>
                            {DEFAULT_NETWORK_CONFIG_MAP[network].name}
                        </span>
                    </div>
                    <div className='flex gap-3'>
                        <MouseoverTooltip text='Copy Address'>
                            <Button
                                variant='muted'
                                icon
                                onClick={() => {
                                    copyToClipboard(publicKey.toString())
                                    close?.()
                                    notify({ message: 'Address copied to clipboard.' })
                                }}
                            >
                                <FaCopy />
                            </Button>
                        </MouseoverTooltip>
                        <MouseoverTooltip text='View on Explorer'>
                            <a
                                href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <Button variant='muted' icon>
                                    <FaExternalLinkAlt />
                                </Button>
                            </a>
                        </MouseoverTooltip>
                    </div>
                </div>
                <WalletDisconnectButton />
            </div>
        </div>
    )
}