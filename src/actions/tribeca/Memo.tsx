'use client'

import { buildStubbedTransaction, createMemoInstruction } from '@saberhq/solana-contrib'
import { useEffect, useState } from 'react'

import { Textarea } from '@/components/tribeca/inputs/InputText'
import { serializeToBase64 } from '@/utils/tribeca/makeTransaction'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import type { ActionFormProps } from './types'

/**
 * Form component for creating a memo transaction
 */
function Memo({ actor, setError, setTxRaw }: ActionFormProps) {
    const [memo, setMemo] = useState('')
    const { network } = useEnvironment()

    useEffect(() => {
        if (memo === '') {
            setError('Memo cannot be empty')
        }
    }, [memo, setError])

    const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMemo = e.target.value
        setMemo(newMemo)
        
        try {
            const txStub = buildStubbedTransaction(
                network !== 'localnet' ? network : 'devnet',
                [createMemoInstruction(newMemo, [actor])]
            )
            setTxRaw(serializeToBase64(txStub))
            setError(null)
        } catch (ex) {
            setTxRaw('')
            console.debug('Error creating memo', ex)
            setError('Memo is too long')
        }
    }

    return (
        <label className="flex flex-col gap-1" htmlFor="memo">
            <span className="text-sm">Memo</span>
            <Textarea
                id="memo"
                className="h-auto"
                rows={4}
                placeholder="The memo for the DAO to send."
                value={memo}
                onChange={handleMemoChange}
            />
        </label>
    )
}

export { Memo }