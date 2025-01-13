import type { Network } from '@saberhq/solana-contrib'
import type { Cluster, TransactionInstruction } from '@solana/web3.js'
import { PublicKey, Transaction } from '@solana/web3.js'

const STATIC_BLOCKHASH = 'GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W'

const FEE_PAYERS = {
    devnet: new PublicKey('A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP'),
    mainnet: new PublicKey('9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg'),
} as const

/**
 * Serializes a transaction to base64 string
 */
export function serializeToBase64(tx: Transaction): string {
    return tx
        .serialize({
            requireAllSignatures: false,
            verifySignatures: false,
        })
        .toString('base64')
}

/**
 * Creates a new transaction with the given instructions
 */
export function makeTransaction(
    network: Network,
    ixs: TransactionInstruction[]
): Transaction {
    const tx = new Transaction()
    tx.recentBlockhash = STATIC_BLOCKHASH
    tx.feePayer = network === 'devnet' ? FEE_PAYERS.devnet : FEE_PAYERS.mainnet
    tx.instructions = ixs
    return tx
}

/**
 * Generates a link for inspecting the contents of a transaction
 * 
 * @param cluster - The Solana cluster to inspect on
 * @param tx - The transaction to inspect
 * @returns The inspection URL
 */
export function generateInspectLink(
    cluster: Cluster,
    tx: Transaction
): string {
    const baseUrl = 'https://anchor.so/tx/inspector'
    const params = new URLSearchParams({
        cluster,
        message: serializeToBase64(tx),
    })
    
    return `${baseUrl}?${params.toString()}`
}