'use client'

import { GaugeSDK } from '@quarryprotocol/gauge'
import { useSail } from '@rockooor/sail'
import Countdown from 'react-countdown'
import invariant from 'tiny-invariant'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { Card } from '@/components/tribeca/Card'
import { CardItem } from '@/components/tribeca/CardItem'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { useParsedGaugemeister } from '@/utils/tribeca/parsers'
import { tsToDate } from '@/utils/tribeca/utils'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'

interface GaugemeisterInfoProps {
    className?: string
}

/**
 * Component displaying information about the current gauge epoch
 */
function GaugemeisterInfo({ className }: GaugemeisterInfoProps) {
    const gaugemeister = useGaugemeister()
    const { data: gm } = useParsedGaugemeister(gaugemeister)
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    const nextEpochStartsAt = gm
        ? tsToDate(gm.accountInfo.data.nextEpochStartsAt)
        : null

    const handleTriggerNextEpoch = async (sdkMut: any) => {
        invariant(gaugemeister, 'Gaugemeister must be present')
        
        const gaugeSDK = GaugeSDK.load({
            provider: sdkMut.provider,
        })
        
        const triggerTX = gaugeSDK.gauge.triggerNextEpoch({
            gaugemeister,
        })
        
        await handleTX(
            await wrapTx(triggerTX), 
            'Trigger next epoch'
        )
    }

    const renderNextEpochStart = () => {
        if (!nextEpochStartsAt) {
            return <ContentLoader className="h-4 w-12" />
        }

        return nextEpochStartsAt <= new Date() 
            ? (
                <AsyncButton onClick={handleTriggerNextEpoch}>
                    Trigger next epoch
                </AsyncButton>
            ) 
            : <Countdown date={nextEpochStartsAt} />
    }

    const renderNextRewardsPeriod = () => {
        if (!nextEpochStartsAt) {
            return <ContentLoader className="h-4 w-12" />
        }

        const endDate = new Date(
            nextEpochStartsAt.getTime() +
            (gm?.accountInfo.data.epochDurationSeconds ?? 0) * 1000
        )

        return (
            <>
                {nextEpochStartsAt.toLocaleString()} -<br />
                {endDate.toLocaleString()}
            </>
        )
    }

    return (
        <Card title="Epoch Info" className={className}>
            <CardItem label="Current Epoch">
                <div className="flex items-center gap-2.5 h-7">
                    {gm ? (
                        gm.accountInfo.data.currentRewardsEpoch
                    ) : (
                        <div className="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
                    )}
                </div>
            </CardItem>
            
            <CardItem label="Next Epoch Start">
                <div className="flex items-center gap-2.5 h-7">
                    {renderNextEpochStart()}
                </div>
            </CardItem>
            
            <CardItem label="Next Rewards Period">
                <div className="flex items-center gap-2.5 h-14 text-sm leading-snug">
                    {renderNextRewardsPeriod()}
                </div>
            </CardItem>
        </Card>
    )
}

export { GaugemeisterInfo }