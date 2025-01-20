'use client'

import '@solana/wallet-adapter-react-ui/styles.css'

import type { Network } from '@saberhq/solana-contrib'
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'

import { environments } from '@/utils/tribeca/environments'
import { EnvironmentProvider } from '@/hooks/tribeca/useEnvironment'

interface Props {
    children: React.ReactNode
}

const SOLE_NETWORKS: Record<string, Network> = {
    'app.saberdao.io': 'mainnet-beta',
    'goki.so': 'mainnet-beta',
    'tribeca.so': 'mainnet-beta',
    'devnet.tribeca.so': 'devnet',
}

/**
 * The only network for the app to display, if applicable.
 */
export const SOLE_NETWORK: Network | null =
    typeof window !== 'undefined' 
        ? isLocalhost(window.location.hostname)
            // ? 'devnet'
            ? 'mainnet-beta'
            : SOLE_NETWORKS[window.location.hostname] ?? null 
        : null

function isLocalhost(hostname: string): boolean {
    return hostname === 'localhost' || 
           hostname.startsWith('localhost:') ||
           hostname === '127.0.0.1' ||
           hostname.startsWith('127.0.0.1:')
}

export function WalletConnectorProvider({ children }: Props) {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
        ],
        []
    )
    
    const network = typeof window !== 'undefined' 
        ? isLocalhost(window.location.hostname)
            // ? 'devnet'
            ? 'mainnet-beta'
            : SOLE_NETWORKS[window.location.hostname] ?? 'mainnet-beta'
        : 'mainnet-beta'

    return (
        <ConnectionProvider endpoint={environments[network].endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <EnvironmentProvider>{children}</EnvironmentProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}
