'use client'

import type { SmartWalletTransactionData } from '@gokiprotocol/client'
import type BN from 'bn.js'
import { useCallback, useState } from 'react'

/**
 * Custom hook for managing state in localStorage with type safety
 * @param key The key to store the state under in localStorage
 * @param defaultState The default state if nothing is stored
 * @returns A tuple of [state, setState] similar to useState
 */
export function useLocalStorageState<T>(
    key: string,
    defaultState: T
): [T, (newState: T) => void] {
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return defaultState
        }
        
        const storedState = localStorage.getItem(key)
        if (storedState) {
            try {
                return JSON.parse(storedState) as T
            } catch (e) {
                console.warn(`Error parsing stored state for key ${key}:`, e)
                return defaultState
            }
        }
        return defaultState
    })

    const setLocalStorageState = useCallback(
        (newState: T) => {
            const changed = state !== newState
            if (!changed) {
                return
            }
            setState(newState)
            if (newState === null) {
                localStorage.removeItem(key)
            } else {
                localStorage.setItem(key, JSON.stringify(newState))
            }
        },
        [state, key]
    )

    return [state, setLocalStorageState]
}

/**
 * Shortens an address to show only the first and last few characters
 * @param address The address to shorten
 * @param chars Number of characters to show at start and end
 * @returns The shortened address
 */
export function shortenAddress(address: string, chars = 5): string {
    return `${address.substring(0, chars)}...${address.substring(
        address.length - chars
    )}`
}

/**
 * Converts a Solana timestamp (seconds) to a JavaScript Date
 * @param num The timestamp in seconds
 * @returns The corresponding Date object
 */
export const tsToDate = (num: BN): Date => new Date(num.toNumber() * 1_000)

/**
 * Generates a link to view a transaction on Goki
 * @param tx The transaction data
 * @returns The URL to view the transaction
 */
export const gokiTXLink = (tx: SmartWalletTransactionData): string =>
    `https://goki.so/wallets/${tx.smartWallet.toString()}/tx/${tx.index.toString()}`