'use client'

import type { PublicKey } from '@solana/web3.js'

import { AddressWithContext } from '@/components/tribeca/program/AddressWithContext'
import { Box } from './Box'

interface Account {
    name?: string
    pubkey: PublicKey
    isSigner: boolean
    isWritable: boolean
}

interface IXAccountsProps {
    accounts: Account[]
}

/**
 * Component that displays a list of instruction accounts with their properties
 */
function IXAccounts({ accounts }: IXAccountsProps) {
    return (
        <Box title={`Accounts (${accounts.length})`} className="p-0">
            <div className="overflow-x-auto whitespace-nowrap">
                {accounts.map((account, i) => (
                    <div
                        key={`account_${i}`}
                        className="px-6 py-2 flex items-center gap-4 justify-between border-t border-t-gray-150 dark:border-t-warmGray-600"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 font-semibold">
                                {account.name ?? `Account #${i}`}
                            </span>
                            <div className="flex items-center gap-2">
                                {account.isWritable && (
                                    <div className="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                                        <div className="h-2 w-2 bg-saber rounded-full" />
                                        <span>writable</span>
                                    </div>
                                )}
                                {account.isSigner && (
                                    <div className="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                                        <div className="h-2 w-2 bg-accent rounded-full" />
                                        <span>signer</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-gray-800 font-medium flex-shrink-0">
                            <AddressWithContext
                                pubkey={account.pubkey}
                                prefixLinkUrlWithAnchor
                            />
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    )
}

export type { Account, IXAccountsProps }
export { IXAccounts }