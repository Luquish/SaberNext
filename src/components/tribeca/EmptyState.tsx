'use client'

import SolanaIcon from '../layout/WalletLayout/SolanaIcon.svg'
import { WalletButton } from '@/components/tribeca/layout/GovernorLayout/Header/WalletButton'

interface Props {
    icon?: React.ReactNode
    title: string
    children?: React.ReactNode
    className?: string
}

/**
 * Empty state component with optional icon and content
 */
function EmptyState({
    icon,
    title,
    children,
    className,
}: Props) {
    return (
        <div className={`w-full py-12 text-sm flex flex-col items-center ${className || ''}`}>
            {icon && (
                <div className="w-20 h-20 mb-3">
                    <style jsx>{`
                        div > svg,
                        div > img {
                            width: 100%;
                            height: 100%;
                            color: #D1D5DB; /* text-gray-300 */
                        }
                    `}</style>
                    {icon}
                </div>
            )}
            <div className="h-6">
                <span className="text-secondary dark:text-coolGray-300">
                    {title}
                </span>
            </div>
            <div>{children}</div>
        </div>
    )
}

/**
 * Specialized empty state for wallet connection
 */
function EmptyStateConnectWallet(props: Partial<Props>) {
    return (
        <EmptyState
            icon={<SolanaIcon />}
            title="Connect your wallet to view this page."
            {...props}
        >
            <WalletButton/>
        </EmptyState>
    )
}

export { EmptyState, EmptyStateConnectWallet }