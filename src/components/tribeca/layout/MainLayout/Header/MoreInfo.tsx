'use client'

import { useRef, useState } from 'react'
import {
    FaBook,
    FaCode,
    FaDiscord,
    FaEllipsisH,
    FaMedium,
    FaTwitter,
} from 'react-icons/fa'

import { APP_CONFIG } from '@/config/tribeca'
import { Drop } from '@/components/tribeca/Drop'

interface SocialItem {
    label: string
    href: string
    slug: string
    icon: React.ReactElement
}

export function MoreInfo() {
    const [show, setShow] = useState(false)
    const targetRef = useRef(null)

    const MORE_ITEMS = [
        APP_CONFIG.socials.medium && {
            label: 'Medium',
            slug: 'medium',
            href: `https://medium.com/@${APP_CONFIG.socials.medium}`,
            icon: <FaMedium />,
        },
        APP_CONFIG.socials.twitter && {
            label: 'Twitter',
            slug: 'twitter',
            href: `https://twitter.com/${APP_CONFIG.socials.twitter}`,
            icon: <FaTwitter />,
        },
        APP_CONFIG.socials.discord && {
            label: 'Discord',
            href: `https://discord.gg/${APP_CONFIG.socials.discord}`,
            slug: 'discord',
            icon: <FaDiscord />,
        },
        APP_CONFIG.code && {
            label: 'Code',
            href: APP_CONFIG.code,
            slug: 'code',
            icon: <FaCode />,
        },
        APP_CONFIG.docs && {
            label: 'Docs',
            href: APP_CONFIG.docs,
            slug: 'docs',
            icon: <FaBook />,
        },
    ].filter((x): x is SocialItem => !!x)

    return (
        <>
            <button
                ref={targetRef}
                onClick={() => setShow(!show)}
                className='text-xl'
            >
                <FaEllipsisH />
            </button>
            <Drop
                placement='bottom-end'
                show={show}
                onDismiss={() => setShow(false)}
                target={targetRef.current}
            >
                <div className='flex flex-col flex-nowrap p-2 bg-white shadow border rounded dark:bg-warmGray-850 dark:border-warmGray-800'>
                    {MORE_ITEMS.map((item) => (
                        <a
                            href={item.href}
                            key={item.slug}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='space-x-3 text-gray-900 hover:text-saber p-2 font-medium flex items-center appearance-none dark:text-white dark:hover:text-saber'
                        >
                            <div>{item.icon}</div>
                            <div>{item.label}</div>
                        </a>
                    ))}
                </div>
            </Drop>
        </>
    )
}