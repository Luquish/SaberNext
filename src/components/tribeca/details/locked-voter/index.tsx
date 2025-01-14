'use client'

import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { AddressesInfo } from '@/components/tribeca/gauges/AddressesInfo'
import { ExecutiveCouncilInfo } from '@/components/tribeca/gauges/ExecutiveCouncilInfo'
import { GaugesInfo } from '@/components/tribeca/gauges/GaugesInfo'
import { GovernorInfo } from '@/components/tribeca/gauges/GovernorInfo'
import { LockerInfo } from '@/components/tribeca/gauges/LockerInfo'

/**
 * View component that displays detailed governance configuration and related accounts
 */
function GovernanceDetailsView() {
    useGovWindowTitle('Details')
    const { meta } = useGovernor()

    return (
        <GovernancePage title="Governance Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GovernorInfo />
                <LockerInfo />
                <ExecutiveCouncilInfo />
                {meta?.gauge && !meta.gauge.hidden && (
                    <GaugesInfo gaugemeister={meta.gauge.gaugemeister} />
                )}
                {meta?.addresses && (
                    <AddressesInfo addresses={meta.addresses} />
                )}
            </div>
        </GovernancePage>
    )
}

export { GovernanceDetailsView }