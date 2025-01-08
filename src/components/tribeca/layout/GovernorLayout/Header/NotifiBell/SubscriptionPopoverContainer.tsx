'use client'

import type { MessageSignerWalletAdapterProps } from '@solana/wallet-adapter-base'

import { SubscriptionCard } from './SubscriptionCard'
import { SubscriptionPopover } from './SubscriptionPopover'
import { WalletDisconnected } from './WalletDisconnected'

interface Props {
    daoName: string
    governor: string
    walletPublicKey: string | null
    signer: MessageSignerWalletAdapterProps | null
}

function WalletDisconnectedPopover() {
    return (
        <SubscriptionCard
            body={
                <div className='w-full min-h-[16rem] flex flex-col items-center justify-center'>
                    <WalletDisconnected className='w-8 h-8' />
                    <span className='text-lg text-secondary text-center'>
                        No wallet connected
                    </span>
                </div>
            }
        />
    )
}

function WalletUnsupportedPopover() {
    return (
        <SubscriptionCard
            body={
                <div className='w-full min-h-[16rem] flex flex-col items-center justify-center'>
                    <span className='text-lg text-white text-center'>
                        Unsupported wallet
                    </span>
                    <span className='text-secondary text-center'>
                        Supported wallets include Phantom, Solflare, and Slope
                    </span>
                </div>
            }
        />
    )
}

export function SubscriptionPopoverContainer({
    daoName,
    governor,
    walletPublicKey,
    signer,
}: Props) {
    if (walletPublicKey === null) {
        return <WalletDisconnectedPopover />
    }

    if (signer === null) {
        return <WalletUnsupportedPopover />
    }

    return (
        <SubscriptionPopover
            daoName={daoName}
            governor={governor}
            walletPublicKey={walletPublicKey}
            signer={signer}
        />
    )
}