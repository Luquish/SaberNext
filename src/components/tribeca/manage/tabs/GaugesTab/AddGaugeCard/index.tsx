'use client'

import { RewarderProvider } from '@rockooor/react-quarry'

import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'
import { useParsedGaugemeister } from '@/utils/tribeca/parsers'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { CreateGaugesButton } from './CreateGaugesButton'
import { EnableGaugesButton } from './EnableGaugesButton'
import { GaugeSelector } from './GaugeSelector'

/**
 * Card component for adding and managing gauges
 */
function AddGaugeCard() {
    const gaugemeister = useGaugemeister()
    const gm = useParsedGaugemeister(gaugemeister)
    const { network } = useEnvironment()

    const rewarderKey = gm.data?.accountInfo.data.rewarder

    if (!rewarderKey) {
        return (
            <Card title="All Gauges">
                <LoadingPage />
            </Card>
        )
    }

    return (
        <RewarderProvider initialState={{ rewarderKey, network }}>
            <Card
                titleStyles={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                title={
                    <>
                        <span>All Gauges</span>
                        <div className="flex items-center gap-4">
                            <CreateGaugesButton />
                            <EnableGaugesButton />
                        </div>
                    </>
                }
            >
                <GaugeSelector />
            </Card>
        </RewarderProvider>
    )
}

export { AddGaugeCard }