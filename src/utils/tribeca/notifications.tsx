'use client'

import type { Network } from '@saberhq/solana-contrib'
import React from 'react'
import { toast } from 'react-hot-toast'

interface NotifyArgs {
    /**
     * Main notification message
     */
    message?: string
    /**
     * Additional description or content
     */
    description?: React.ReactNode
    /**
     * Single transaction ID
     */
    txid?: string
    /**
     * Multiple transaction IDs
     */
    txids?: string[]
    /**
     * Network environment
     */
    env?: Network
    /**
     * Notification type
     */
    type?: 'success' | 'error' | 'info' | 'warn'
}

const SOLANA_EXPLORER_URL = 'https://explorer.solana.com/tx'

/**
 * Creates a transaction link component
 */
function TransactionLink({ txid, env }: { txid: string; env?: Network }): JSX.Element {
    const cluster = env?.toString() ?? ''
    const shortTxid = `${txid.slice(0, 8)}...${txid.slice(-8)}`
    
    return (
        <a
            href={`${SOLANA_EXPLORER_URL}/${txid}?cluster=${cluster}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {shortTxid}
        </a>
    )
}

const txContainerStyle = {
    display: 'inline-flex',
    gap: '4px',
} as const

/**
 * Shows a notification with optional transaction links
 */
export function notify({
    message,
    description,
    txid,
    txids,
    env,
    type = 'info',
}: NotifyArgs): void {
    // Convert single txid array to txid
    if (txids?.length === 1) {
        txid = txids[0]
    }

    // Log for debugging
    const logLevel = type === 'warn' ? 'warn' : type === 'error' ? 'error' : 'info'
    console[logLevel](`Notify: ${message ?? '<no message>'}`, description, {
        env,
        txid,
        txids,
        type,
    })

    // Generate description with transaction link(s)
    let descriptionContent = description
    if (txid) {
        descriptionContent = (
            <div>
                View Transaction:{' '}
                <TransactionLink txid={txid} env={env} />
            </div>
        )
    } else if (txids) {
        descriptionContent = (
            <div>
                View Transactions:{' '}
                <div style={txContainerStyle}>
                    {txids.map((id, i) => (
                        <a
                            key={i}
                            href={`${SOLANA_EXPLORER_URL}/${id}?cluster=${env?.toString() ?? ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            [{i + 1}]
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    // Show toast notification
    toast(
        <div className="flex flex-col text-sm gap-1">
            <div className="font-medium">{message}</div>
            {descriptionContent && (
                <div className="text-secondary">{descriptionContent}</div>
            )}
        </div>
    )
}