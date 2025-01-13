'use client'

import type { PublicKey } from '@solana/web3.js'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { formatDurationSeconds } from '@/utils/tribeca/format'
import { useGaugemeisterData } from '@/utils/tribeca/parsers'

interface Props {
    gaugemeister: PublicKey,
}

/**
 * Component that displays information about gauges and their configuration
 */
function GaugesInfo({ gaugemeister }: Props) {
    const { data: gmData } = useGaugemeisterData(gaugemeister)
    
    return (
        <Card title="Gauges" className="pb-2">
            <AttributeList
                transformLabel={false}
                attributes={{
                    Gaugemeister: gmData?.publicKey,
                    Foreman: gmData?.account.foreman,
                    Operator: gmData?.account.operator,
                    Rewarder: gmData?.account.rewarder,
                    'Epoch Duration': gmData
                        ? formatDurationSeconds(gmData.account.epochDurationSeconds)
                        : gmData,
                }}
            />
        </Card>
    )
}

export { GaugesInfo }