'use client'

import type { GokiSDK } from '@gokiprotocol/client'
import type { ComponentPropsWithRef } from 'react'

import { useSDK } from '@/contexts/tribeca/sdk'
import { WalletButton } from '@/components/tribeca/layout/GovernorLayout/Header/WalletButton'
import { Button } from './Button'

interface Props
    extends Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> {
    onClick?: (sdkMut: GokiSDK) => Promise<void> | void
    connectWalletOverride?: string
}

export function AsyncButton({
    onClick,
    children,
    ...rest
}: Props) {
    const { sdkMut } = useSDK()
    
    return sdkMut !== null ? (
        <Button
            onClick={
                onClick
                    ? async () => {
                        await onClick(sdkMut)
                    }
                    : undefined
            }
            {...rest}
        >
            {children}
        </Button>
    ) : (
        <WalletButton />
    )
}