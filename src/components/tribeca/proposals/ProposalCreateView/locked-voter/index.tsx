'use client'

import { useSDK } from '@/contexts/tribeca/sdk'
import { EmptyStateConnectWallet } from '@/components/tribeca/EmptyState'
import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { ProposalCreateInner } from './ProposalCreateInner'

/**
 * View component for creating new proposals
 */
function ProposalCreateView() {
    const { sdkMut } = useSDK()

    return (
        <GovernancePage
            title="Create a Proposal"
            containerStyles={{
                width: '91.666667%',
                maxWidth: '80rem',
                marginLeft: 'auto',
                marginRight: 'auto',
            }}
        >
            {sdkMut ? (
                <ProposalCreateInner />
            ) : (
                <Card title="Proposal Info">
                    <EmptyStateConnectWallet />
                </Card>
            )}
        </GovernancePage>
    )
}

export { ProposalCreateView }