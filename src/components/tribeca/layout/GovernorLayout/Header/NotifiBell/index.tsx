'use client';

import type { MessageSignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useMemo, useState } from 'react';
import { FaBell } from 'react-icons/fa';

import { useGovernor } from '@/hooks/tribeca/useGovernor';
import { Drop } from '@/components/tribeca/Drop';
import { SubscriptionPopoverContainer } from './SubscriptionPopoverContainer';

interface Props {
  className?: string;
}

function isMessageSignerWalletAdapter<T>(
    instance: T
): instance is T & MessageSignerWalletAdapterProps {
    if (
        typeof instance === 'object' &&
        instance !== null &&
        'signMessage' in instance
    ) {
        const { signMessage } = instance as T & { readonly signMessage: unknown };
        return typeof signMessage === 'function';
    }
    return false;
}

export function NotifiBell({ className }: Props) {
    const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const { daoName, governor } = useGovernor();

    const wallet = useAnchorWallet();
    const { wallet: solanaWallet } = useWallet();
    const walletPublicKey: string | null = useMemo(() => {
        if (wallet) {
            return wallet.publicKey.toBase58();
        }
        return null;
    }, [wallet]);
    const messageSigner: MessageSignerWalletAdapterProps | null = useMemo(() => {
        if (solanaWallet) {
            const wrapped = solanaWallet.adapter;
            if (wrapped) {
                const underlying = wrapped;
                if (isMessageSignerWalletAdapter(underlying)) {
                    return underlying;
                }
            }
        }

        return null;
    }, [solanaWallet]);

    const title: string = useMemo(() => {
        if (!daoName || !governor) {
            return 'Loading';
        } else if (!walletPublicKey) {
            return 'Please connect your wallet';
        } else if (!messageSigner) {
            return 'Unsupported wallet';
        } else {
            return 'Manage Notifications';
        }
    }, [daoName, governor, walletPublicKey, messageSigner]);

    const isEnabled = daoName && governor;

    return (
        <>
            <button
                className={className}
                disabled={!isEnabled}
                title={title}
                onClick={() => {
                    setShowNotifications((show) => !show);
                }}
                ref={setTargetRef}
            >
                <FaBell />
            </button>
            <Drop
                onDismiss={() => setShowNotifications(false)}
                target={targetRef}
                show={showNotifications}
                placement="bottom-end"
            >
                {isEnabled ? (
                    <SubscriptionPopoverContainer
                        daoName={daoName}
                        governor={governor.toString()}
                        walletPublicKey={walletPublicKey}
                        signer={messageSigner}
                    />
                ) : null}
            </Drop>
        </>
    );
}
