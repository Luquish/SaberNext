'use client'

import Link from 'next/link'

interface FooterLink {
    href: string
    label: string
    external?: boolean
}

const footerLinks: FooterLink[] = [
    {
        href: 'https://twitter.com/saber_hq',
        label: 'X (Twitter)',
        external: true,
    },
    {
        href: 'https://t.me/saber_hq',
        label: 'Telegram',
        external: true,
    },
    {
        href: 'https://doc.saberdao.io/',
        label: 'Docs',
        external: false,
    },
    {
        href: '/email',
        label: 'Email',
        external: false,
    },
    {
        href: '/cookies',
        label: 'Cookies',
        external: false,
    },
    {
        href: '/privacy',
        label: 'Privacy',
        external: false,
    },
]

function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="w-full py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="text-gray-400 text-sm">
                        © {currentYear} Saber DAO. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 items-center">
                        {footerLinks.map(({ href, label, external }) => (
                            external ? (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                                >
                                    {label} ↗
                                </a>
                            ) : (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                    {label}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer