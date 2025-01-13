'use client'

import type { PublicKey } from '@solana/web3.js'

import { TransactionProvider } from '@/components/tribeca/wallet/context'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useParsedTXByKey } from '@/hooks/tribeca/useParsedTX'
import { SmartWalletProvider } from '@/hooks/tribeca/useSmartWallet'
import { InstructionsInner } from './InstructionsInner'

interface Props {
    txKey: PublicKey,
}

/**
 * Component that embeds transaction details with loading state and context providers
 */
function EmbedTX({ txKey }: Props) {
    const { data: parsedTX, isLoading } = useParsedTXByKey(txKey)
    
    return (
        <div className="py-6">
            {isLoading && !parsedTX && <LoadingPage />}
            {parsedTX && (
                <SmartWalletProvider initialState={parsedTX.tx.account.smartWallet}>
                    <TransactionProvider initialState={parsedTX}>
                        <InstructionsInner />
                    </TransactionProvider>
                </SmartWalletProvider>
            )}
        </div>
    )
}

export { EmbedTX }