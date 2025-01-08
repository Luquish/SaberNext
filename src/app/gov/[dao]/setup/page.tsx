'use client'

import { useGovernorInfo, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { InitializeGovernanceCard } from '@/components/tribeca/setup/InitializeGovernanceCard'
import { OnboardingChecklist } from '@/components/tribeca/setup/OnboardingChecklist'

/**
 * View component for governance setup and initialization
 */
function GovernanceSetupView() {
    const info = useGovernorInfo()
    useGovWindowTitle('Setup')

    return (
        <GovernancePage title="Initialize Governance">
            <div className="flex flex-col gap-4">
                {info ? <InitializeGovernanceCard info={info} /> : <LoadingPage />}
                <OnboardingChecklist />
            </div>
        </GovernancePage>
    )
}

export { GovernanceSetupView }