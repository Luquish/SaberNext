import { Metadata } from 'next'

import { Providers } from './providers'
import Navbar from '@/components/saber/layout/Navbar'
import Footer from '@/components/saber/layout/Footer'
import { inter, josefin, montserrat } from '@/config/saber/fonts'
import '@/styles/global.css'

// SEO and Open Graph metadata configuration
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://saberdao.io'),
    title: {
        default: 'Saber | Solana AMM',
        template: '%s | Saber',
    },
    description: 'Saber is an automated market maker for trading stable asset pairs on Solana.',
    openGraph: {
        title: 'Saber: Solana AMM',
        description: 'Saber is an automated market maker for trading stable asset pairs on Solana.',
        url: '/',
        siteName: 'Saber: Solana AMM',
        images: [{
            url: '/ogimage.jpg',
            width: 1200,
            height: 630,
            alt: 'Saber Protocol',
        }],
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Saber on Solana',
        description: 'Saber is an automated market maker for trading stable asset pairs on Solana.',
        images: ['/ogimage.jpg'],
        creator: '@SaberProtocol',
    },
    robots: {
        index: true,
        follow: true,
    },
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html 
            lang="en" 
            className={`${inter.className} ${josefin.className} ${montserrat.className}`}
        >
            <body className="bg-black">
                <Providers>
                    <div className="text-white min-h-screen w-full flex justify-center p-5">
                        <div className="max-w-7xl flex flex-col w-full gap-5">
                            <header>
                                <Navbar />
                            </header>
                            
                            <main>
                                {children}
                            </main>
                            
                            <footer>
                                <Footer />
                            </footer>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    )
}