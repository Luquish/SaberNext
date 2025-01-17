'use client'

import { RewarderProvider } from '@rockooor/react-quarry'
import { GMProvider, useGM } from '@/contexts/tribeca/gauges' 
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { AllGaugesInner } from '@/components/tribeca/gauges/AllGaugesInner'

import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'


function GaugesAllInner() {
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

function GaugesAllPage() {
    return (
        <GMProvider>
            <GaugesAllInner />
        </GMProvider>
    )
}

export default GaugesAllPage