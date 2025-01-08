'use client'

import { useAccountData, useToken } from '@rockooor/sail'
import { deserializeMint, TokenAmount } from '@saberhq/token-utils'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { useMemo } from 'react'

import { AttributeList } from '@/components/tribeca/AttributeList'

interface MintInfoProps {
    mint: PublicKey
}

/**
 * Component for displaying detailed information about a token mint
 */
function MintInfo({ mint }: MintInfoProps) {
    const wallet = useAnchorWallet()
    const { data, loading } = useAccountData(mint)
    const mintInfo = useMemo(() => {
        if (!data) {
            return null
        }
        try {
            return deserializeMint(data.accountInfo.data)
        } catch (e) {
            return null
        }
    }, [data])
    const { data: token } = useToken(mint)

    if (!loading && !data) {
        const owner = wallet?.publicKey
        if (!owner) {
            return <p>Please connect your wallet.</p>
        }
        return <div>Token not found on this network.</div>
    }

    return (
        <AttributeList
            loading={loading}
            attributes={{
                Address: mint,
                Supply:
                    token && mintInfo
                        ? new TokenAmount(token, mintInfo.supply)
                        : mintInfo?.supply,
                Decimals: mintInfo?.decimals,
                'Mint Authority': mintInfo?.mintAuthority,
                'Freeze Authority': mintInfo?.freezeAuthority,
                'Initialized?': mintInfo?.isInitialized,
            }}
        />
    )
}

export { MintInfo }