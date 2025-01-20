'use client'

import { useGovernorInfo } from '@/hooks/tribeca/useGovernor'
import { EmptyState } from '@/components/tribeca/EmptyState'
import { Card } from '@/components/tribeca/Card'
import { GaugeForemanEC } from './GaugeForemanEC'

/**
 * Component for displaying DAO integration and setup status checklist
 */
function OnboardingChecklist() {
    const info = useGovernorInfo()

    if (!info) {
        return (
            <Card title="Integration Status">
                <EmptyState title="Your DAO is not yet set up." />
            </Card>
        )
    }

    return (
        <Card title="Integration Status">
            <GaugeForemanEC />
        </Card>
    )
}

export { OnboardingChecklist }