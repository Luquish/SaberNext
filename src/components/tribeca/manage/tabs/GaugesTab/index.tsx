'use client'

import { AddGaugeCard } from './AddGaugeCard'
import { GrantToEC } from './GrantToEC'

/**
 * Tab component for managing quarry gauges and permissions
 */
function GaugesTab() {
    return (
        <div className="flex flex-col gap-4">
            <GrantToEC />
            <AddGaugeCard />
        </div>
    )
}

export { GaugesTab }