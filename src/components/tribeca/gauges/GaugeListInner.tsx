'use client'

import { findEpochGaugeAddress, GaugeData } from '@quarryprotocol/gauge'
import { QuarryInfo, useRewarder } from '@rockooor/react-quarry'
import { exists, ProgramAccount } from '@saberhq/solana-contrib'
import { useQuery } from '@tanstack/react-query'
import BN from 'bn.js'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { useGM } from '@/contexts/tribeca/gauges'
import { useBatchedEpochGauges } from '@/utils/tribeca/parsers'
import { useAllGauges } from '@/hooks/tribeca/gauges/useGauges'
import { GaugeListRow } from './GaugeListRow'
import { GaugeRowPlaceholder } from '@/components/tribeca/gauges/GaugeRowPlaceholder'

const DEFAULT_PLACEHOLDER_LIMIT = 10

interface GaugeListInnerProps {
    limit?: number
}

interface GaugeQuarryPair {
    gauge: ProgramAccount<GaugeData>
    quarry: QuarryInfo
    nextRank: number | null
    currentRank?: number
}

/**
 * Inner component for displaying the list of gauges with sorting and filtering
 */
function GaugeListInner({ limit }: GaugeListInnerProps) {
    const { quarries, rewarder } = useRewarder()
    const { gaugemeister, votingEpoch } = useGM()
    const { gauges, gaugeKeys } = useAllGauges()

    const votingEpochNumber = useMemo(() => {
        if (typeof votingEpoch === 'number') {
            return votingEpoch
        }
        return votingEpoch?.account.currentRewardsEpoch ?? null
    }, [votingEpoch])

    const { data: epochGaugeKeys } = useQuery({
        queryKey: ['epochGaugeKeys', gaugemeister?.toString(), votingEpochNumber],
        queryFn: async () => {
            invariant(gaugemeister && gaugeKeys && votingEpochNumber !== null, 'Missing required data')
            return await Promise.all(
                gaugeKeys.map(async (gaugeKey) => {
                    const [key] = await findEpochGaugeAddress(gaugeKey, votingEpochNumber)
                    return key
                })
            )
        },
        enabled: !!gaugemeister && !!gaugeKeys && exists(votingEpochNumber),
    })

    const { data: epochGauges } = useBatchedEpochGauges(epochGaugeKeys)

    const totalShares = useMemo(
        () => epochGauges?.every((eg) => eg !== undefined)
            ? epochGauges
                .map((eg) => eg?.account.totalPower ?? new BN(0))
                .reduce((acc, n) => acc.add(n), new BN(0))
            : null,
        [epochGauges]
    )

    const sortedEpochGauges = useMemo(
        () => epochGauges?.slice().sort((a, b) => {
            if (!a) return 1
            if (!b) return -1
            return -a.account.totalPower.cmp(b.account.totalPower)
        }),
        [epochGauges]
    )

    const gaugesExisting = useMemo(
        () => gauges
            ?.filter((gauge) => gauge !== null)
            .map((gauge) => {
                if (!gauge) return gauge
                
                const quarry = quarries?.find((q) =>
                    q.key.equals(gauge.account.quarry)
                )
                if (!quarry) return quarry

                const nextRank = (sortedEpochGauges?.findIndex((eg) =>
                    eg?.account.gauge.equals(gauge.publicKey)
                ) ?? -1) + 1

                return { 
                    gauge, 
                    quarry, 
                    nextRank: nextRank === 0 ? null : nextRank, 
                }
            })
            .sort((a: GaugeQuarryPair | null, b: GaugeQuarryPair | null) => {
                if (!a) return 1
                if (!b) return -1
            
                // Asegurarnos que a y b son del tipo correcto
                if ('gauge' in a && 'quarry' in a && 'gauge' in b && 'quarry' in b) {
                    const { gauge: gaugeA, quarry: quarryA } = a
                    const { gauge: gaugeB, quarry: quarryB } = b
            
                    if (gaugeA.account.isDisabled) return 1
                    if (gaugeB.account.isDisabled) return -1
            
                    return -quarryA.quarry.account.rewardsShare.cmp(
                        quarryB.quarry.account.rewardsShare
                    )
                }
                
                return 0
            })
            .map((el, i) => el ? { ...el, currentRank: i + 1 } : el)
            .sort((a: GaugeQuarryPair | null, b: GaugeQuarryPair | null) => {
                if (!a) return 1
                if (!b) return -1
                if (!a.nextRank) return 1
                if (!b.nextRank) return -1
                return a.nextRank > b.nextRank ? 1 : -1
            })
            .slice(0, limit ?? gauges.length),
        [gauges, limit, quarries, sortedEpochGauges]
    )

    const dailyRewardsRate = rewarder instanceof BN 
        ? rewarder 
        : rewarder?.account.annualRewardsRate.div(new BN(365)) ?? null

    return (
        <TableCardBody
            head={
                <tr>
                    <th className="w-20">#</th>
                    <th>Gauge</th>
                    <th className="w-48">Current Share</th>
                    <th className="w-48">Next Share</th>
                </tr>
            }
        >
            {(!gaugesExisting || gaugesExisting.length === 0) && (
                Array(limit ?? DEFAULT_PLACEHOLDER_LIMIT)
                    .fill(null)
                    .map((_, i) => <GaugeRowPlaceholder key={i} />)
            )}
            {gaugesExisting?.map((result: GaugeQuarryPair | null, i) => {
                if (!result) {
                    return <GaugeRowPlaceholder key={i} />
                }
                const { gauge, quarry, currentRank, nextRank } = result
                return (
                    <GaugeListRow
                        key={quarry.key.toString()}
                        quarry={quarry}
                        gauge={gauge}
                        currentRank={currentRank}
                        nextRank={nextRank}
                        totalShares={totalShares}
                        dailyRewardsRate={dailyRewardsRate}
                    />
                )
            })}
        </TableCardBody>
    )
}

export { GaugeListInner }