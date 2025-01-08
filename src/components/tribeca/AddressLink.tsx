'use client'

import type { PublicKey } from '@solana/web3.js'
import copy from 'copy-to-clipboard'
import { FaRegCopy } from 'react-icons/fa'

import { notify } from '@/utils/tribeca/notifications'
import { displayAddress } from '@/utils/tribeca/programs'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { shortenAddress } from '@/utils/tribeca/utils'

interface Props {
    address: PublicKey
    className?: string
    showCopy?: boolean
    children?: React.ReactNode
    showRaw?: boolean
    shorten?: boolean
    prefixLinkUrlWithAnchor?: boolean
}

export const AddressLink = ({
    address,
    className,
    shorten = true,
    showCopy = false,
    showRaw = true,
    prefixLinkUrlWithAnchor = false,
    children,
}: Props) => {
    const { network } = useEnvironment()
    const urlPrefix = prefixLinkUrlWithAnchor
        ? 'https://anchor.so'
        : 'https://explorer.solana.com'

    return (
        <div className="inline-flex items-center">
            <a
                className={`text-gray-800 dark:text-warmGray-200 hover:text-primary ${className || ''}`}
                href={`${urlPrefix}/address/${address.toString()}?cluster=${
                    network?.toString() ?? ''
                }`}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children ??
                    (showRaw
                        ? shorten
                            ? shortenAddress(address.toString())
                            : address.toString()
                        : displayAddress(address.toString(), shorten))}
            </a>
            {showCopy && (
                <FaRegCopy
                    className="ml-1 cursor-pointer text-gray-800 dark:text-warmGray-200 hover:text-primary"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        copy(address.toString())
                        notify({ message: 'Copied address to clipboard.' })
                    }}
                />
            )}
        </div>
    )
}