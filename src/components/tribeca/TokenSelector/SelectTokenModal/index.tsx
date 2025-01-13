'use client'

import { useUserATAs } from '@rockooor/sail'
import type { Token } from '@saberhq/token-utils'
import { RAW_SOL_MINT } from '@saberhq/token-utils'
import { useAnchorWallet } from '@solana/wallet-adapter-react'

import { useSDK } from '@/contexts/tribeca/sdk'
import { LoadingSpinner } from '../../LoadingSpinner'
import type { ModalProps } from '../../Modal'
import { Modal } from '../../Modal'
import { TokenIcon } from '../../TokenIcon'
import SolanaLogo from './solana.svg'
import Solscan from './solscan.svg'
import SolscanGray from './solscan-gray.svg'

interface SelectTokenModalProps extends Omit<ModalProps, 'children'> {
    tokens: readonly Token[]
    onSelect: (token: Token) => void
}

/**
 * Modal for selecting a token with balance display
 */
function SelectTokenModal({
    onSelect,
    tokens,
    ...modalProps
}: SelectTokenModalProps) {
    const wallet = useAnchorWallet()
    const { nativeBalance } = useSDK()
    const balances = useUserATAs(...tokens)

    return (
        <Modal {...modalProps} className="p-0">
            <div className="grid gap-3 py-3">
                <div className="h-6 flex items-center justify-center">
                    <SolanaLogo />
                </div>
                <div className="mt-10 px-7">
                    <h2 className="font-bold text-xl">Select a token</h2>
                </div>
                <div>
                    {tokens.map((token) => {
                        const userBalance = balances.find((b) =>
                            b?.balance.token.equals(token)
                        )
                        const balance = token.mintAccount.equals(RAW_SOL_MINT)
                            ? nativeBalance
                            : userBalance?.balance

                        return (
                            <div
                                role="button"
                                tabIndex={0}
                                key={token.address}
                                className="cursor-pointer hover:bg-gray-100 h-16 flex items-center px-7"
                                onClick={() => onSelect(token)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onSelect(token)
                                    }
                                }}
                            >
                                <div className="flex items-center h-full w-full justify-between border-b">
                                    <div className="flex gap-3 items-center w-full h-full">
                                        <TokenIcon size={20} token={token} />
                                        <div className="flex flex-col flex-shrink-[1]">
                                            <span className="text-sm font-medium">
                                                {token.name}
                                            </span>
                                            {wallet && (
                                                <span className="text-xs text-secondary">
                                                    {userBalance === undefined ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        balance?.formatUnits() ?? 
                                                        `0 ${token.symbol}`
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        className="group"
                                        href={`https://solscan.io/address/${token.address}`}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        rel="noreferrer"
                                    >
                                        <Solscan className="hidden group-hover:block" />
                                        <SolscanGray className="group-hover:hidden" />
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    )
}

export type { SelectTokenModalProps }
export { SelectTokenModal }