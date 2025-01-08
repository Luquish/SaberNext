'use client'

import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { SetupGaugesCard } from '@/components/tribeca/gauges/SetupGaugesCard'

/**
 * Page for setting up gauges
 */
function GaugesSetupPage() {
    useGovWindowTitle('Setup Gauges')
    
    return (
        <GovernancePage title="Setup Gauges">
            <div className="flex flex-col gap-4">
                <SetupGaugesCard />
            </div>
        </GovernancePage>
    )
}

export default GaugesSetupPage