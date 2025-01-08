'use client'

import type { PublicKey } from '@solana/web3.js'
import makeBlockie from 'ethereum-blockies-base64'
import { FaTwitter } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'

import { useAddressImage } from '@/hooks/tribeca/cardinal/useAddressImage'
import { useCardinalDisplayName } from '@/hooks/tribeca/cardinal/useAddressName'
import { AddressLink } from './AddressLink'
import { ContentLoader } from './ContentLoader'

interface Props {
    address: PublicKey
    href?: string
}

/**
 * Profile component showing user avatar and details
 */
function Profile({ address, href }: Props) {
    const { name, displayName } = useCardinalDisplayName(address)
    const { addressImage, loadingImage } = useAddressImage(address)
    
    const image = (
        <Image
            className="h-10 w-10 rounded-full"
            alt={`Profile of ${displayName ?? address.toString()}`}
            src={addressImage ?? makeBlockie(address.toString())}
        />
    )
    
    return (
        <div className="text-sm">
            <div className="flex gap-2 items-center">
                <div className="h-10 w-10 rounded-full flex">
                    {loadingImage ? (
                        <ContentLoader className="h-10 w-10 rounded-full" />
                    ) : href ? (
                        <Link href={href}>{image}</Link>
                    ) : (
                        image
                    )}
                </div>
                <div className="flex flex-col leading-normal">
                    <div className="flex gap-1 items-center">
                        <div className="h-5 flex items-center">
                            {displayName === undefined ? (
                                <ContentLoader className="h-4 w-12 rounded" />
                            ) : (
                                <span className={`font-medium ${name ? 'text-white' : 'text-warmGray-400'}`}>
                                    {displayName}
                                </span>
                            )}
                        </div>
                        {name?.toString().startsWith('@') && (
                            <a
                                href={`https://twitter.com/${name.toString().slice(1)}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FaTwitter className="text-[#1da1f2]" />
                            </a>
                        )}
                    </div>
                    <AddressLink className="text-gray-400" address={address} showCopy />
                </div>
            </div>
        </div>
    )
}

export { Profile }