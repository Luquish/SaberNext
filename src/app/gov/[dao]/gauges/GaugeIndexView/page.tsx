'use client'

import { usePubkey } from '@rockooor/sail'
import { useParams } from 'next/navigation'

import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { useGauge } from '@/hooks/tribeca/gauges/useGauges'

/**
 * Page component that displays details for a specific gauge
 */
function GaugePage() {
    const params = useParams()
    const stakedMintStr = params.stakedMint as string
    const { token } = useGauge(usePubkey(stakedMintStr))
    
    useGovWindowTitle(`Gauge - ${token?.name ?? ''}`)
    
    return (
        <GovernancePage title="Gauge">
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
                {/* Gauge content will go here */}
            </div>
        </GovernancePage>
    )
}

export default GaugePage

// CHEQUEAR SI ESTA BIEN