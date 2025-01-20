'use client'

import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
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
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <GovernorInfo />
                    <LockerInfo />
                    <ExecutiveCouncilInfo />
                    {meta?.gauge && !meta.gauge.hidden && (
                        <GaugesInfo gaugemeister={meta.gauge.gaugemeister} />
                    )}
                </div>
                
                {meta?.addresses && (
                    <div className="w-full mt-4"> {/* Contenedor separado para AddressesInfo */}
                        <AddressesInfo addresses={meta.addresses} />
                    </div>
                )}
            </div>
        </GovernancePage>
    )
}

export { GovernanceDetailsView }