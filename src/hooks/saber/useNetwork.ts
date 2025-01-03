import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { useState } from 'react'
import { useReadLocalStorage } from 'usehooks-ts'

/**
 * Formats the network as a string.
 * @param network
 * @returns
 */
const formatNetwork = (network: WalletAdapterNetwork) => {
    if (network === 'mainnet-beta') {
        return 'mainnet' as const
    }
    return network
}

export default function useNetwork() {
    const storedRpc = useReadLocalStorage('rpc') as string ?? undefined
    const [network] = useState(WalletAdapterNetwork.Mainnet)

    const [endpoint] = useState(process.env.NEXT_PUBLIC_RPC_URL)
    const [wsEndpoint] = useState(process.env.NEXT_PUBLIC_RPC_WS)

    return {
        network,
        wsEndpoint,
        formattedNetwork: formatNetwork(network),
        endpoint: storedRpc || endpoint,
    }
}