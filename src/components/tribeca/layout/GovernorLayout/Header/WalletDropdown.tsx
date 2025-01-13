'use client'

import { shortenAddress } from '@cardinal/namespaces'
import { useSail } from '@rockooor/sail'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import { useCardinalDisplayName } from '@/hooks/tribeca/cardinal/useAddressName'
import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { Drop } from '@/components/tribeca/Drop'
import { AccountPopover } from '@/components/tribeca/layout/MainLayout/Header/WalletDropdown/AccountPopover'
import { WalletButton } from './WalletButton'

interface Props {
    className?: string
}

export function WalletDropdown({ className }: Props) {
    const wallet = useAnchorWallet()
    const { name, reverseEntryKey } = useCardinalDisplayName(wallet?.publicKey)
    const { wallet: solanaWallet } = useWallet()

    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null)
    const [showAccountPopover, setShowAccountPopover] = useState<boolean>(false)

    const { refetch } = useSail()
    useEffect(() => {
        if (reverseEntryKey) {
            void refetch(reverseEntryKey)
        }
        // handle is desired to be in here to enforce refresh of the name when modal closes
    }, [refetch, reverseEntryKey])

    return (
        <>
            {wallet ? (
                <>
                    <button
                        className={`
                            ${className}
                            px-3 py-1 flex items-center gap-2 justify-between rounded border
                            dark:text-white dark:border-none dark:bg-warmGray-800 dark:hover:bg-coolGray-800
                            z-20 md:z-auto
                        `}
                        ref={setTargetRef}
                        onClick={() => {
                            setShowAccountPopover((prev) => !prev)
                        }}
                    >
                        <div>
                            {solanaWallet && (
                                <>
                                    {typeof solanaWallet.adapter.icon === 'string' && (
                                        <Image
                                            className='h-4 w-4'
                                            src={solanaWallet.adapter.icon}
                                            alt={`Icon for wallet ${solanaWallet.adapter.name}`}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                        <span className='text-sm font-semibold'>
                            {name === undefined || !wallet ? (
                                <ContentLoader />
                            ) : name === null ? (
                                shortenAddress(wallet.publicKey.toString())
                            ) : (
                                name.toString()
                            )}
                        </span>
                    </button>
                    <Drop
                        onDismiss={() => setShowAccountPopover(false)}
                        target={targetRef}
                        show={showAccountPopover}
                        placement='bottom-end'
                    >
                        <AccountPopover close={() => setShowAccountPopover(false)} />
                    </Drop>
                </>
            ) : (
                <WalletButton />
            )}
        </>
    )
}