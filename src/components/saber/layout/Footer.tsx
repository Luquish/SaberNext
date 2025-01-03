'use client'

import Link from 'next/link'

interface FooterLink {
    href: string
    label: string
    external?: boolean
}

const footerLinks: FooterLink[] = [
    {
        href: 'https://doc.saberdao.io/saber-dao/risks',
        label: 'Risks',
        external: true,
    },
    // Aquí puedes agregar más links fácilmente
]

function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="w-full py-6 mt-auto bg-black/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex-grow flex-wrap flex justify-center gap-6 items-center">
                        {footerLinks.map(({ href, label, external }) => (
                            external ? (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {label}
                                </a>
                            ) : (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {label}
                                </Link>
                            )
                        ))}
                    </div>
                    <div className="text-gray-400">
                        &copy; {currentYear} Saber DAO
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer