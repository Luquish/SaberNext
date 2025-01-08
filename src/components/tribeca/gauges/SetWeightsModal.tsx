'use client'

import type { GaugeData } from '@quarryprotocol/gauge'
import {
    findEpochGaugeVoterAddress,
    findGaugeAddress,
    findGaugeVoteAddress,
    findGaugeVoterAddress,
    GAUGE_CODERS,
    GaugeSDK,
} from '@quarryprotocol/gauge';
import { useRewarder } from '@rockooor/react-quarry';
import { useSail, useTokens } from '@rockooor/sail';
import { TransactionEnvelope } from '@saberhq/solana-contrib';
import type { ProgramAccount } from '@saberhq/token-utils';
import { findEscrowAddress } from '@tribecahq/tribeca-sdk';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useSDK } from '@/contexts/tribeca/sdk';
import { AttributeList } from '@/components/tribeca/AttributeList';
import { useModal } from '@/components/tribeca/Modal/context';
import { ModalInner } from '@/components/tribeca/Modal/ModalInner';
import { TransactionPlanExecutor } from '@/components/tribeca/TransactionPlanExecutor';
import type { TransactionPlan } from '@/components/tribeca/TransactionPlanExecutor/plan';
import { useGaugemeister, useGMData } from '@/hooks/tribeca/gauges/useGaugemeister';
import { useAllGauges } from '@/hooks/tribeca/gauges/useGauges';
import { useUpdateGaugeWeights } from '@/hooks/tribeca/gauges/useUpdateGaugeWeights';

/**
 * Modal component for updating gauge weights
 */
function SetWeightsModal() {
    const gaugemeister = useGaugemeister()
    const { data: gmData } = useGMData()
    const { sdkMut } = useSDK()
    const { rewarderKey } = useRewarder()
    const { sharesDiff, escrowKey } = useUpdateGaugeWeights()
    const { gaugeKeys, gauges } = useAllGauges()
    const { close } = useModal()
    const { refetchMany } = useSail()

    const makePlan = useCallback(async () => {
        invariant(sdkMut, 'sdk missing')
        invariant(rewarderKey, 'rewarder key')
        invariant(escrowKey, 'escrow key')
        invariant(gaugemeister && gaugeKeys && gmData, 'gaugemeister')

        const plan: TransactionPlan = { steps: [] }
        const gauge = GaugeSDK.load({ provider: sdkMut.provider })

        // Create gauge voter if needed
        const [gaugeVoterKey] = await findGaugeVoterAddress(gaugemeister, escrowKey)
        const gv = await gauge.gauge.fetchGaugeVoter(gaugeVoterKey)
        
        if (!gv) {
            const { tx: createGVTX } = await gauge.gauge.createGaugeVoter({
                gaugemeister,
                escrow: escrowKey,
            })
            plan.steps.push({
                title: 'Setup Gauge Voting',
                txs: [createGVTX],
            })
        }

        const gaugeVoteKeys = await Promise.all(
            gaugeKeys.map(async (gaugeKey) => {
                const [gaugeVoteKey] = await findGaugeVoteAddress(
                    gaugeVoterKey,
                    gaugeKey
                );
                return gaugeVoteKey;
            })
        );
        const gaugeVotes = await refetchMany(gaugeVoteKeys);
        const parsedGaugeVotes = gaugeVotes.map((gv) =>
            gv && 'data' in gv
                ? GAUGE_CODERS.Gauge.accounts.gaugeVote.parse(gv.data)
                : null
        );

        const disabledGaugesToReset =
        gauges
            ?.filter(
                (gauge): gauge is ProgramAccount<GaugeData> =>
                    !!gauge?.account.isDisabled &&
                !!parsedGaugeVotes.find(
                    (gv) => gv?.gauge.equals(gauge.publicKey) && gv.weight !== 0
                )
            )
            .map((gauge) => ({
                gauge: gauge?.publicKey,
                weight: 0,
            })) ?? [];

        const shareUpdates = await gauge.gauge.setVotes({
            gaugemeister,
            weights: [
                ...disabledGaugesToReset,
                ...(await Promise.all(
                    sharesDiff.map(async (diff) => {
                        invariant(diff.nextShareParsed !== null, 'next share parsed')
                        const [gaugeKey] = await findGaugeAddress(
                            gaugemeister,
                            diff.quarry.publicKey
                        );
                        return {
                            gauge: gaugeKey,
                            weight: diff.nextShareParsed,
                        };
                    })
                )),
            ],
        });

        if (shareUpdates.length > 0) {
            plan.steps.push({
                title: 'Update Shares',
                txs: TransactionEnvelope.pack(...shareUpdates),
            })
        }

        const gaugesDiffed = await Promise.all(
            sharesDiff.map(async (diff) => {
                const [gaugeKey] = await findGaugeAddress(
                    gaugemeister,
                    diff.quarry.publicKey
                );
                return { gaugeKey, diff };
            })
        );

        const gaugesToUpdate = gaugeKeys.filter((k, i) => {
            return gaugeVotes[i] || gaugesDiffed.find((gd) => gd.gaugeKey.equals(k));
        });

        // build the list of all gauges to commit
        const gaugesToCommit = gaugesToUpdate.filter((gk) => {
            return (
                // Gauge should not be disabled
                !gauges?.find(
                    (gauge) => gauge?.publicKey.equals(gk) && gauge?.account.isDisabled
                ) &&
                gaugeKeys.find((gaugeKey, i) => {
                    if (!gk.equals(gaugeKey)) {
                        return false;
                    }

                    // get the new vote
                    const nextVote = gaugesDiffed.find((gd) =>
                        gd.gaugeKey.equals(gaugeKey)
                    );

                    // if the vote has been changed to zero, don't commit it
                    if (nextVote && !nextVote.diff.nextShareParsed) {
                        return false;
                    }

                    // otherwise, commit if the vote exists OR if the next vote is non-zero
                    return parsedGaugeVotes[i]?.weight || nextVote?.diff.nextShareParsed;
                })
            );
        });

        const [escrow] = await findEscrowAddress(
            gmData.account.locker,
            sdkMut.provider.wallet.publicKey
        );
        const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrow);
        const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
            gaugeVoter,
            gmData.account.currentRewardsEpoch + 1
        );
        const epochGaugeVoterData = await gauge.gauge.fetchEpochGaugeVoter(
            epochGaugeVoter
        );

        if (epochGaugeVoterData) {
            if (!epochGaugeVoterData.allocatedPower.isZero()) {
                const revertTXs = await gauge.gauge.revertVotes({
                    gaugemeister,
                    gauges: gaugesToUpdate,
                });
                plan.steps.push({
                    title: 'Revert Votes',
                    txs: TransactionEnvelope.pack(...revertTXs),
                })
            }
            plan.steps.push({
                title: 'Reset committed votes',
                txs: [
                    await gauge.gauge.resetEpochGaugeVoter({
                        gaugemeister,
                    }),
                ],
            })
        } else {
            plan.steps.push({
                txs: [
                    await gauge.gauge.prepareEpochGaugeVoter({
                        gaugemeister,
                    }),
                ],
                title: 'Prepare votes',
            })
        }

        const voteTXs = await gauge.gauge.commitVotes({
            gaugemeister,
            gauges: gaugesToCommit,
            checkGaugeVotesExist: false,
        });
        plan.steps.push({
            txs: TransactionEnvelope.pack(...voteTXs),
            title: 'Commit votes',
        })

        return plan;
    }, [escrowKey, gaugeKeys, gaugemeister, gauges, gmData, refetchMany, rewarderKey, sdkMut, sharesDiff])

    const allTokens = useTokens(
        sharesDiff.map((share) => share.quarryInfo.quarry.account.tokenMintKey),
    )

    return (
        <ModalInner title="Update Weights">
            <div className="mb-4">
                <AttributeList
                    transformLabel={false}
                    attributes={sharesDiff.reduce(
                        (acc, el) => ({
                            ...acc,
                            [allTokens.find((token) =>
                                token.data?.mintAccount.equals(
                                    el.quarryInfo.quarry.account.tokenMintKey,
                                ),
                            )?.data?.name ??
                            el.quarryInfo.quarry.account.tokenMintKey.toString()]: 
                            `${el.prevShareParsed ?? '(null)'} -> ${el.nextShareParsed ?? '(null)'}`,
                        }),
                        {},
                    )}
                />
            </div>
            <TransactionPlanExecutor makePlan={makePlan} onComplete={close} />
        </ModalInner>
    )
}

export { SetWeightsModal }
