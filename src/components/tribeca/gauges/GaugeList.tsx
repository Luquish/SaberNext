'use client'

import { RewarderProvider } from '@rockooor/react-quarry'

import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useGM } from '@/contexts/tribeca/gauges'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { GaugeListInner } from '@/components/tribeca/gauges/GaugeListInner'

interface GaugeListProps {
    limit?: number
}

/**
 * Container component for the gauge list that handles the rewarder provider
 */
function GaugeList({ limit }: GaugeListProps) {
    const { rewarderKey } = useGM()
    const { network } = useEnvironment()

    if (!rewarderKey) {
        return <LoadingPage className="h-96" />
    }

    return (
        <RewarderProvider initialState={{ rewarderKey, network }}>
            <GaugeListInner limit={limit} />
        </RewarderProvider>
    )
}

export { GaugeList }