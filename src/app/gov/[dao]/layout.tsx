'use client'

import { Toaster, resolveValue, toast } from 'react-hot-toast'
import { VscClose } from 'react-icons/vsc'
import { useConditionalDarkMode } from '@/hooks/tribeca/useConditionalDarkMode'
import { TribecaProviders } from '@/providers/tribeca'
import { Metadata } from 'next'

// Metadata configuration for Tribeca section
export const metadata: Metadata = {
    metadataBase: new URL('https://tribeca.so'), // CHEQUEAR
    title: {
        default: 'Tribeca - Solana Governance By DAOs, For DAOs',
        template: '%s | Tribeca',
    },
    description: 'Tribeca is a governance platform on Solana built by DAOs, for DAOs.',
    openGraph: {
        title: 'Tribeca - Solana Governance',
        description: 'Tribeca is a governance platform on Solana built by DAOs, for DAOs.',
        url: '/',
        siteName: 'Tribeca DAO Platform',
        images: [{
            url: '/images/tribeca/og-image.png',
            width: 1200,
            height: 630,
            alt: 'A Solana-based governance platform built by DAOs, for DAOs.',
        }],
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tribeca DAO Platform',
        description: 'Tribeca is a governance platform on Solana built by DAOs, for DAOs.',
        images: ['/public/tribeca/og-image.png'],
        creator: '@TribecaDAO',
    },
    robots: {
        index: true,
        follow: true,
    },
    themeColor: '#282A2C',
}

export default function TribecaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useConditionalDarkMode(true)

    return (
        <TribecaProviders>
            <div className="h-full w-full">
                {children}
                <Toaster position="bottom-right">
                    {(t) => (
                        <div
                            className="bg-white border p-4 w-full max-w-sm shadow rounded relative dark:bg-gray-50 dark:border-warmGray-600"
                            style={{
                                opacity: t.visible ? 1 : 0,
                            }}
                        >
                            <button
                                className="absolute right-3 top-3 text-secondary hover:text-gray-600"
                                onClick={() => toast.dismiss(t.id)}
                            >
                                <VscClose />
                            </button>
                            {resolveValue(t.message, t)}
                        </div>
                    )}
                </Toaster>
            </div>
        </TribecaProviders>
    )
}