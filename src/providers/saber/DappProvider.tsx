'use client'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { QueryClient, QueryClientConfig } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { useMemo, useState, useEffect } from 'react'
import useNetwork from '@/hooks/saber/useNetwork'
import invariant from 'tiny-invariant'

// Import wallet adapter styles
require('@solana/wallet-adapter-react-ui/styles.css')

// Constants
const CACHE_TIME = 1000 * 60 * 60 // 1 hour
const PERSISTED_QUERIES = [
    'swaps',
    'pools',
    'poolsData',
    'prices',
    'reserves',
    'lpTokenAmounts',
    'tokenList',
    'rewardsList',
] as const

// React Query configuration
const queryConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            gcTime: CACHE_TIME,
            retry: 5,
        },
    },
}

// React Query client instance
const queryClient = new QueryClient(queryConfig)

// Storage persistence configuration
const persister = createSyncStoragePersister({
    storage: typeof window !== 'undefined' ? window.localStorage : null,
})

interface DappProviderProps {
    children: React.ReactNode
}

export function DappProvider({ children }: DappProviderProps) {
    const { endpoint, wsEndpoint } = useNetwork()
    const [isReady, setIsReady] = useState(false)

    // Initialize wallet adapters
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        []
    )

    // Wait for component mount to avoid SSR issues
    useEffect(() => {
        setIsReady(true)
    }, [])

    if (!isReady) {
        return null
    }

    // Ensure network endpoint exists
    invariant(endpoint, 'Network endpoint is required')

    return (
        <PersistQueryClientProvider 
            client={queryClient} 
            persistOptions={{
                persister,
                maxAge: CACHE_TIME,
                dehydrateOptions: {
                    shouldDehydrateQuery: query => 
                        PERSISTED_QUERIES.includes(query.queryKey[0] as typeof PERSISTED_QUERIES[number]),
                },
            }}
        >
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
            
            <ConnectionProvider 
                endpoint={endpoint} 
                config={{ wsEndpoint }}
            >
                <WalletProvider 
                    wallets={wallets} 
                    autoConnect
                >
                    <WalletModalProvider>
                        {children}
                        <Toaster 
                            theme="dark" 
                            position="bottom-right" 
                            richColors={true} 
                        />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </PersistQueryClientProvider>
    )
} 