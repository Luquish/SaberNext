'use client'

import { pickBy } from 'lodash-es'
import { FaDiscord, FaGithub, FaMedium, FaTwitter } from 'react-icons/fa'
import Image from 'next/image'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { Button } from '@/components/tribeca/Button'

const SOCIALS = {
    discord: <FaDiscord />,
    github: <FaGithub />,
    medium: <FaMedium />,
    twitter: <FaTwitter />,
}

/**
 * Footer component with social links and governance information
 */
function Footer() {
    const { manifest } = useGovernor()
    if (!manifest) return null

    const otherLinks = pickBy(manifest.links ?? {}, (_v, k) => {
        return !(k in SOCIALS) && k !== 'app'
    })

    return (
        <footer className="w-full bg-warmGray-900 pt-5">
            <div className="max-w-5xl md:w-11/12 mx-auto">
                <div className="flex flex-col gap-8 md:flex-row justify-between py-8">
                    <div className="md:block">
                        <a
                            href={manifest.links?.website?.url ?? '#'}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <div className="w-9 h-9">
                                <Image
                                    src={manifest.governance.iconURL}
                                    alt={`Icon of ${manifest.governance.name}`}
                                    width={36}
                                    height={36}
                                />
                            </div>
                        </a>
                    </div>
                    <div className="flex gap-24">
                        {Object.entries(otherLinks).length > 0 && (
                            <div>
                                <h2 className="text-white font-semibold mb-4">
                                    {manifest.governance.name}
                                </h2>
                                <div className="flex flex-col gap-3 text-warmGray-600 text-sm">
                                    {Object.entries(otherLinks).map(([name, link]) => (
                                        <a
                                            key={name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h2 className="text-white font-semibold mb-4">Tribeca</h2>
                            <div className="flex flex-col gap-3 text-warmGray-600 text-sm">
                                {Object.entries({
                                    Documentation: 'https://docs.tribeca.so',
                                    GitHub: 'https://github.com/TribecaHQ',
                                }).map(([name, link]) => (
                                    <a key={name} href={link} target="_blank" rel="noreferrer">
                                        {name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex md:justify-end">
                        <div>
                            {manifest?.links?.app && (
                                <a
                                    href={manifest.links.app.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button size="md" variant="outline">
                                        {manifest.links.app.label}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center py-8 mt-8 border-t border-t-warmGray-850 text-xs">
                    <p className="text-warmGray-700">Built by the Tribeca DAO</p>
                    <div className="flex gap-4">
                        {Object.entries(SOCIALS).map(([id, icon]) => {
                            const link = manifest.links?.[id]
                            if (!link) return null
                            return (
                                <a
                                    key={id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    <span className="w-4 h-4 inline-block">
                                        {icon}
                                    </span>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export { Footer }