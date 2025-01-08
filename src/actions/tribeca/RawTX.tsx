'use client'

import { extractErrorMessage } from '@rockooor/sail'
import { Transaction } from '@solana/web3.js'

import { HelperCard } from '@/components/tribeca/HelperCard'
import { Textarea } from '@/components/tribeca/inputs/InputText'
import { LabeledInput } from '@/components/tribeca/inputs/LabeledInput'
import type { ActionFormProps } from './types'

/**
 * Form component for submitting raw transactions
 */
function RawTX({ setError, txRaw, setTxRaw }: ActionFormProps) {
    const handleTransactionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newTxRaw = e.target.value
        setTxRaw(newTxRaw)
        
        try {
            const buffer = Buffer.from(newTxRaw, 'base64')
            const tx = Transaction.from(buffer)
            
            if (tx.instructions.length === 0) {
                throw new Error('no instruction data')
            }
            
            setError(null)
        } catch (err) {
            setError(
                `Invalid transaction data: ${extractErrorMessage(err) ?? '(unknown)'}`
            )
        }
    }

    return (
        <>
            <HelperCard variant="warn">
                <div className="font-semibold">
                    Warning: this page is for advanced users only. Invalid transaction
                    data may cause this page to freeze. Documentation will be coming soon.
                </div>
            </HelperCard>
            
            <HelperCard variant="muted">
                <div className="prose prose-sm prose-light">
                    <p>
                        This page allows proposing any arbitrary transaction for execution
                        by the DAO. The fee payer and recent blockhash will not be used.
                    </p>
                </div>
            </HelperCard>
            
            <LabeledInput
                label="Transaction (base64)"
                Component={Textarea}
                id="instructionsRaw"
                className="h-auto font-mono"
                rows={4}
                placeholder="Paste raw base64 encoded transaction message"
                value={txRaw}
                onChange={handleTransactionChange}
            />
        </>
    )
}

export { RawTX }