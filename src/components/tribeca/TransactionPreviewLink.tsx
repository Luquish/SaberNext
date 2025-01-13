'use client'

import {
    RECENT_BLOCKHASH_STUB,
    SolanaProvider,
    TransactionEnvelope,
} from '@saberhq/solana-contrib'
import { PublicKey } from '@solana/web3.js'
import type { ProposalInstruction } from '@tribecahq/tribeca-sdk'
import { useMemo } from 'react'

import { useProvider } from '@/hooks/tribeca/useProvider'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'

interface Props {
    instructions: ProposalInstruction[]
}

const DUMMY_WALLETS = {
    devnet: new PublicKey('A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP'),
    mainnet: new PublicKey('9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg'),
}

/**
 * Link component to preview transaction details on Anchor.so
 */
function TransactionPreviewLink({ instructions }: Props) {
    const { provider, providerMut, network } = useProvider()

    const txEnv = useMemo(() => {
        const dummyWallet = {
            publicKey: network === 'devnet' ? DUMMY_WALLETS.devnet : DUMMY_WALLETS.mainnet,
            signTransaction: () => { throw new Error('unimplemented') },
            signAllTransactions: () => { throw new Error('unimplemented') },
        }

        return new TransactionEnvelope(
            providerMut ?? SolanaProvider.load({
                connection: provider.connection,
                sendConnection: provider.connection,
                wallet: dummyWallet,
            }),
            instructions.map((ix) => ({
                ...ix,
                data: Buffer.from(ix.data),
            }))
        )
    }, [instructions, network, provider.connection, providerMut])

    const inspectLink = useMemo(() => {
        const t = txEnv.build()
        t.recentBlockhash = RECENT_BLOCKHASH_STUB
        return `https://${
            network === 'mainnet-beta' ? '' : `${network}.`
        }anchor.so/tx/inspector?message=${encodeURIComponent(
            t.serializeMessage().toString('base64')
        )}`
    }, [network, txEnv])

    if (network === 'localnet') {
        return null
    }

    return (
        <ExternalLink href={inspectLink}>
            View Details on Anchor.so
        </ExternalLink>
    )
}

export { TransactionPreviewLink }