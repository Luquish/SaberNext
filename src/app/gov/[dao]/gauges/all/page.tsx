'use client'

import { RewarderProvider } from '@rockooor/react-quarry'

import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useGM } from '@/contexts/tribeca/gauges'
import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { AllGaugesInner } from '@/components/tribeca/gauges/AllGaugesInner'

/**
 * Page component that displays all gauges with rewarder configuration
 */
function GaugesAllPage() {
    const { path } = useGovernor()
    const { rewarderKey } = useGM()
    const { network } = useEnvironment()

    useGovWindowTitle('All Gauges')

    return (
        <GovernancePage
            title="All Gauges"
            backLink={{
                label: 'Gauges',
                href: `${path}/gauges`,
            }}
        >
            {rewarderKey ? (
                <RewarderProvider 
                    initialState={{ 
                        rewarderKey, 
                        network,
                    }}
                >
                    <AllGaugesInner />
                </RewarderProvider>
            ) : (
                <Card title="All Gauges">
                    <LoadingPage className="h-96" />
                </Card>
            )}
        </GovernancePage>
    )
}

export default GaugesAllPage