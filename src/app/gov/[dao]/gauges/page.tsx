'use client'

import { RewarderProvider } from '@rockooor/react-quarry'
import Link from 'next/link'

import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { useParsedGaugemeister } from '@/utils/tribeca/parsers'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'
import { AllGaugesPreview } from '@/components/tribeca/gauges/AllGaugesPreview'
import { GaugemeisterInfo } from '@/components/tribeca/gauges/GaugemeisterInfo'
import { UserGauges } from '@/components/tribeca/gauges/UserGauges'

/**
 * Main view for the gauges section
 */
function GaugesIndexView() {
    const gaugemeister = useGaugemeister()
    const { govToken, veToken, path } = useGovernor()
    const { network } = useEnvironment()

    const gm = useParsedGaugemeister(gaugemeister) 
    useGovWindowTitle('Gauges')
    
    const rewarderKey = gm.data?.accountInfo.data.rewarder
    console.log('rewarderKey:', rewarderKey)
    
    return (
        <GovernancePage title="Gauges">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <GaugemeisterInfo className="flex-1" />
                    <Card title="Gauge Weight Voting" className="flex-1">
                        <div className="px-8 py-5 text-sm flex flex-col gap-4">
                            <p>
                                Vote for gauge weight with your {veToken?.symbol} tokens (locked{' '}
                                {govToken?.symbol} tokens in{' '}
                                <Link 
                                    className="text-saber hover:text-white"
                                    href={`${path}/locker`}
                                >
                                    Locker
                                </Link>
                                ). Gauge weights are used to determine how much{' '}
                                {govToken?.symbol} each Quarry gets.
                            </p>
                            <p>
                                Your voting power is converted 1:1 to Quarry rewards share,
                                based on the weights you provided.
                            </p>
                            <ExternalLink href="https://docs.tribeca.so/features/gauges">
                                Learn more
                            </ExternalLink>
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col gap-8">
                    {rewarderKey && (
                        <RewarderProvider initialState={{ rewarderKey, network }}>
                            <UserGauges />
                            <AllGaugesPreview />
                        </RewarderProvider>
                    )}
                </div>
            </div>
        </GovernancePage>
    )
}

export default GaugesIndexView