'use client'

import { Card } from '@/components/tribeca/Card'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { SmartWalletProvider } from '@/hooks/tribeca/useSmartWallet'
import { PendingTXs } from './PendingTXs'
import { PublicKey } from '@solana/web3.js'

/**
 * Tab component for managing executive council transactions
 */
function ExecutiveCouncilTab() {
    const { smartWallet } = useGovernor()
    const finalSmartWallet = smartWallet instanceof PublicKey 
        ? smartWallet 
        : smartWallet.account.smartWallet
    
    return (
        <SmartWalletProvider initialState={finalSmartWallet ?? undefined}>
            <div className="flex flex-col gap-4">
                <Card title="Pending Transactions">
                    <PendingTXs />
                </Card>
            </div>
        </SmartWalletProvider>
    )
}

export { ExecutiveCouncilTab }