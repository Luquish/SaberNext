'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { BaseWalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { FaChevronDown } from 'react-icons/fa'

const LABELS = {
    'change-wallet': 'Change wallet',
    'connecting': 'Connecting ...',
    'copy-address': 'Copy address',
    'copied': 'Copied',
    'disconnect': 'Disconnect',
    'has-wallet': 'Connect Wallet',
    'no-wallet': (
        <div>
            Connect<span className='hidden sm:inline'> Wallet</span>
        </div>
    ),
} as const

export function WalletButton() {
    const { publicKey } = useWallet()

    return (
        <div>
            <BaseWalletMultiButton
                // @ts-expect-error - Known issue with wallet adapter types
                labels={LABELS}
            >
                {publicKey ? (
                    <FaChevronDown className='text-black/80 dark:text-slate-200/80' />
                ) : null}
            </BaseWalletMultiButton>
        </div>
    )
}