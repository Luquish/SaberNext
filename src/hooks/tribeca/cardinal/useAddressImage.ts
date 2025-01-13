'use client'

import { breakName } from '@cardinal/namespaces'
import { mapSome } from '@saberhq/solana-contrib'
import { PublicKey } from '@solana/web3.js'
import makeBlockie from 'ethereum-blockies-base64'
import { useEffect, useState } from 'react'

import { useAddressName } from './useAddressName'

const SUNSBR = 'https://cdn.jsdelivr.net/gh/SunnyAggregator/sunny-token-list@master/icons/sunsbr.svg'
export const SUNSBR_OWNER = new PublicKey('7vauTYofpkXXgDegQL9foGuqxBWZmaUKy8yeRyATTywg')

/**
 * Fetches a Twitter profile image for a given handle
 */
const getTwitterImage = async (handle: string): Promise<string | undefined> => {
    try {
        const response = await fetch(
            `https://api.cardinal.so/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handle}&user.fields=profile_image_url`
        )
        const json = (await response.json()) as {
            data: { profile_image_url: string }[]
        }
        return json?.data[0]?.profile_image_url.replace('_normal', '')
    } catch (error) {
        console.error('Error fetching Twitter image:', error)
        return undefined
    }
}

interface AddressImageResult {
    addressImage: string | null | undefined
    loadingImage: boolean
}

/**
 * Hook to get an image for a Solana address, either from Twitter or as a blockie
 */
export const useAddressImage = (address: PublicKey | undefined): AddressImageResult => {
    const [addressImage, setAddressImage] = useState<string | null | undefined>(undefined)
    const [loadingImage, setLoadingImage] = useState(true)
    const { displayName, loadingName } = useAddressName(address)

    const refreshImage = async (displayName: string | null | undefined) => {
        if (!displayName) {
            setAddressImage(displayName)
            return
        }

        try {
            setLoadingImage(true)
            const [handle] = breakName(displayName)
            if (handle) {
                const imageUrl = await getTwitterImage(handle)
                setAddressImage(imageUrl)
            }
        } finally {
            setLoadingImage(false)
        }
    }

    // Generate fallback image using blockies if no Twitter image
    const theAddressImage = addressImage ?? mapSome(address, (a) => 
        a.equals(SUNSBR_OWNER) ? SUNSBR : makeBlockie(a.toString())
    )

    useEffect(() => {
        void refreshImage(displayName)
    }, [displayName])

    return {
        addressImage: theAddressImage,
        loadingImage: loadingImage || loadingName,
    }
}