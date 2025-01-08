'use client'

import { ZERO } from '@quarryprotocol/quarry-sdk'
import { RewarderProvider } from '@rockooor/react-quarry'
import { useState } from 'react'
import Link from 'next/link'

import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { InputSearchText } from '@/components/tribeca/inputs/InputSearchText'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { UpdateGaugeWeightsProvider } from '@/hooks/tribeca/gauges/useUpdateGaugeWeights'
import { useParsedGaugemeister } from '@/utils/tribeca/parsers'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { LockupTooShortTooltip } from '@/components/tribeca/gauges/lockupTooShortTooltip'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'
import { GaugeWeightsForm } from '@/components/tribeca/gauges/GaugeWeightsForm'

/**
 * Page for managing gauge weights
 */
function GaugeWeightsPage() {
    const [filterTerm, setFilterTerm] = useState('')
    const gaugemeister = useGaugemeister()
    const gm = useParsedGaugemeister(gaugemeister)
    const { govToken, veToken, path } = useGovernor()
    const { network } = useEnvironment()
    const { escrow } = useUserEscrow()
    const rewarderKey = gm.data?.accountInfo.data.rewarder

    const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(
        gm.data?.accountInfo.data.nextEpochStartsAt ?? ZERO,
    )

    useGovWindowTitle('Your Gauge Weights')

    return (
        <GovernancePage
            title="Your Gauge Weights"
            backLink={{
                label: 'Gauges',
                href: `${path}/gauges`,
            }}
        >
            <div className="flex flex-col gap-4">
                <Card title="Gauge Weight Voting">
                    <div className="px-8 py-5 text-sm">
                        <p>
                            You can vote for gauge weight with your {veToken?.symbol} tokens
                            (locked {govToken?.symbol} tokens in{' '}
                            <Link 
                                className="text-primary hover:text-white" 
                                href={`${path}/locker`}
                            >
                                Locker
                            </Link>
                            ). Gauge weights are used to determine how much {govToken?.symbol}{' '}
                            each pool gets.
                        </p>
                        <ExternalLink
                            className="mt-4"
                            href="https://docs.tribeca.so/features/gauges"
                        >
                            Learn more
                        </ExternalLink>
                    </div>
                </Card>
                <Card
                    title={
                        <div className="flex w-full items-center justify-between">
                            <div className="flex">
                                <span>Your Gauge Weights</span>
                                {lockupTooShort && <LockupTooShortTooltip />}
                            </div>
                            <InputSearchText
                                onChange={(evt) => setFilterTerm(evt.target.value)}
                                value={filterTerm}
                                placeholder="Filter Gauges.."
                            />
                        </div>
                    }
                >
                    {gm.loading ? (
                        <LoadingPage className="p-16" />
                    ) : (
                        rewarderKey && (
                            <RewarderProvider initialState={{ rewarderKey, network }}>
                                <UpdateGaugeWeightsProvider>
                                    <GaugeWeightsForm filterTerm={filterTerm} />
                                </UpdateGaugeWeightsProvider>
                            </RewarderProvider>
                        )
                    )}
                </Card>
            </div>
        </GovernancePage>
    )
}

export default GaugeWeightsPage