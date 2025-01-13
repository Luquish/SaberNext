'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { Card } from '@/components/tribeca/Card'
import { GaugeList } from '@/components/tribeca/gauges/GaugeList'

/**
 * Preview component showing a limited list of all gauges
 * TODO: add a tree map of all gauges.
 */
function AllGaugesPreview() {
    const { path } = useGovernor()
    
    return (
        <Card
            className="flex items-center justify-between"
            title="All Gauges"
            link={{
                title: 'View all gauges',
                href: `${path}/gauges/all`,
            }}
        >
            <div className="whitespace-nowrap overflow-x-auto">
                <GaugeList limit={3} />
            </div>
        </Card>
    )
}

export { AllGaugesPreview }