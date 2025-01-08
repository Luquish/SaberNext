'use client'

import {
    SignerWallet,
    SolanaProvider,
    TransactionEnvelope,
} from '@saberhq/solana-contrib'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import type { Signer, TransactionInstruction } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import { useMemo } from 'react'

import { useEnvironment } from './useEnvironment'

type ValidInstruction = TransactionInstruction | null | undefined | boolean

/**
 * Hook to manage Solana provider and transaction creation
 */
function useProvider() {
    const wallet = useAnchorWallet()
    const { connection } = useConnection()
    const { network } = useEnvironment()

    const { provider, providerMut } = useMemo(() => {
        const provider = SolanaProvider.init({
            connection,
            wallet: wallet ?? new SignerWallet(Keypair.generate()),
        })

        return {
            provider,
            providerMut: wallet ? provider : null,
        }
    }, [connection, wallet])

    return {
        connected: !!wallet,
        network,
        provider,
        providerMut,
        newTX: (
            instructions: ValidInstruction[] = [],
            signers: Signer[] = []
        ): TransactionEnvelope => {
            return TransactionEnvelope.create(provider, instructions, signers)
        },
    }
}

export { useProvider }