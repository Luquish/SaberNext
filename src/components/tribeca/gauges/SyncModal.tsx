'use client'

import {
    findEpochGaugeVoterAddress,
    findGaugeVoteAddress,
    findGaugeVoterAddress,
    GAUGE_CODERS,
    GaugeSDK,
} from '@quarryprotocol/gauge'
import { useSail } from '@rockooor/sail'
import { TransactionEnvelope } from '@saberhq/solana-contrib'
import { findEscrowAddress } from '@tribecahq/tribeca-sdk'
import { chunk } from 'lodash'
import { useCallback } from 'react'
import invariant from 'tiny-invariant'

import { ModalInner } from '@/components/tribeca/Modal/ModalInner'
import { TransactionPlanExecutor } from '@/components/tribeca/TransactionPlanExecutor'
import type { TransactionPlan } from '@/components/tribeca/TransactionPlanExecutor/plan'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGaugemeister, useGMData } from '@/hooks/tribeca/gauges/useGaugemeister'
import { useAllGauges } from '@/hooks/tribeca/gauges/useGauges'

/**
 * Modal for syncing gauge votes
 */
function SyncModal() {
    const { sdkMut } = useSDK()
    const { gaugeKeys } = useAllGauges()
    const { data: gmData } = useGMData()
    const gaugemeister = useGaugemeister()
    const { refetchMany } = useSail()

    const makePlan = useCallback(async () => {
        invariant(sdkMut && gaugemeister && gaugeKeys && gmData, 'Required data missing')

        const plan: TransactionPlan = { steps: [] }

        const [escrow] = await findEscrowAddress(
            gmData.account.locker,
            sdkMut.provider.wallet.publicKey
        )
        const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrow)
        const gauge = GaugeSDK.load({ provider: sdkMut.provider })

        // Revert votes in chunks of 100
        const chunks = chunk(gaugeKeys, 100)
        const revertTXs = (
            await Promise.all(
                chunks.map(async (chunk) =>
                    gauge.gauge.revertVotes({
                        gaugemeister,
                        gauges: chunk,
                    })
                )
            )
        ).flat()

        if (revertTXs.length) {
            plan.steps.push({
                title: 'Revert Votes',
                txs: TransactionEnvelope.pack(...revertTXs),
            })
        }

        // Handle epoch gauge voter
        const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
            gaugeVoter,
            gmData.account.currentRewardsEpoch + 1
        )
        const epochGaugeVoterData = await gauge.gauge.fetchEpochGaugeVoter(
            epochGaugeVoter
        )

        if (epochGaugeVoterData?.allocatedPower.isZero() === false) {
            plan.steps.push({
                title: 'Reset Committed Votes',
                txs: [
                    await gauge.gauge.resetEpochGaugeVoter({
                        gaugemeister,
                    }),
                ],
            })
        } else if (!epochGaugeVoterData) {
            plan.steps.push({
                title: 'Prepare Votes',
                txs: [
                    await gauge.gauge.prepareEpochGaugeVoter({
                        gaugemeister,
                    }),
                ],
            })
        }

        // Get and parse gauge votes
        const gaugeVoteKeys = await Promise.all(
            gaugeKeys.map(async (gaugeKey) => {
                const [gaugeVoteKey] = await findGaugeVoteAddress(gaugeVoter, gaugeKey)
                return gaugeVoteKey
            })
        )
        const gaugeVotes = await refetchMany(gaugeVoteKeys)
        const parsedGaugeVotes = gaugeVotes.map((gv) =>
            gv && 'data' in gv
                ? GAUGE_CODERS.Gauge.accounts.gaugeVote.parse(gv.data)
                : null
        )

        // Filter and commit votes
        const gaugesToCommit = gaugeKeys.filter((gk) => {
            const gaugeVote = parsedGaugeVotes.find((gv) => gv?.gauge.equals(gk))
            return gaugeVote && gaugeVote.weight !== 0
        })

        const voteTXs = await gauge.gauge.commitVotes({
            gaugemeister,
            gauges: gaugesToCommit,
        })
        
        plan.steps.push({
            title: 'Commit Votes',
            txs: TransactionEnvelope.pack(...voteTXs),
        })

        return plan
    }, [gaugeKeys, gaugemeister, gmData, refetchMany, sdkMut])

    return (
        <ModalInner title="Sync">
            <TransactionPlanExecutor makePlan={makePlan} onComplete={close} />
        </ModalInner>
    )
}

export { SyncModal }