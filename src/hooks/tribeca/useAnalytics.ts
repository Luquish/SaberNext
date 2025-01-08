'use client'

import { ExtraErrorData as ExtraErrorDataIntegration } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useEnvironment } from './useEnvironment'

/**
 * Sets up analytics including Google Analytics and Sentry.
 * IMPORTANT: Only call this hook ONCE at the app root level.
 */
export const useAnalytics = (): void => {
    const { network } = useEnvironment()
    const wallet = useAnchorWallet()
    const walletProviderInfo = useWallet()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Track page views in Google Analytics
    useEffect(() => {
        window.gtag?.('event', 'page_view', {
            page_path: pathname + searchParams.toString(),
            page_location: window.location.href,
            page_title: document.title,
        })
    }, [pathname, searchParams])

    // Set Sentry user context
    const owner = wallet?.publicKey
    useEffect(() => {
        if (owner) {
            Sentry.setUser({
                id: owner.toString(),
            })
        } else {
            Sentry.configureScope((scope) => scope.setUser(null))
        }
    }, [owner])

    // Set Sentry tags for network and wallet provider
    useEffect(() => {
        Sentry.setTag('network', network)
        Sentry.setTag('wallet.provider', walletProviderInfo.wallet?.adapter.name)
    }, [network, walletProviderInfo.wallet?.adapter.name])

    // Initialize Sentry if DSN is provided
    useEffect(() => {
        if (process.env.REACT_APP_SENTRY_DSN) {
            const sentryCfg = {
                environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? 'unknown',
                release: process.env.REACT_APP_SENTRY_RELEASE ?? 'unknown',
            }
            Sentry.init({
                dsn: process.env.REACT_APP_SENTRY_DSN,
                integrations: [
                    new ExtraErrorDataIntegration({
                        depth: 3,
                    }),
                ],
                tracesSampleRate: 0.2,
                ...sentryCfg,
            })

            console.log(
                `Initializing Sentry environment at release ${sentryCfg.release} in environment ${sentryCfg.environment}`
            )
        } else {
            console.warn(
                'REACT_APP_SENTRY_DSN not found. Sentry will not be loaded.'
            )
        }
    }, [])
}