'use client'

import {
    calculateEra,
    calculateEraStart,
    calculatePeriodStart,
    ERA_NUM_PERIODS,
    findEscrowHistoryAddress,
    findLockerHistoryAddress,
    PERIOD_SECONDS,
    SNAPSHOTS_CODERS,
    SnapshotsSDK,
} from '@saberhq/snapshots';
import type { AugmentedProvider } from '@saberhq/solana-contrib';
import {
    isNotNull,
    TransactionEnvelope,
    tsToDate,
} from '@saberhq/solana-contrib';
import { RAW_SOL, TokenAmount } from '@saberhq/token-utils';
import type {
    AccountInfo,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import { SystemProgram } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import BN from 'bn.js';
import JSBI from 'jsbi';
import { chunk, zip } from 'lodash-es';
import { useMemo } from 'react';
import invariant from 'tiny-invariant';

import { useEscrow } from '@/hooks/tribeca/useEscrow';
import { useGovernor } from '@/hooks/tribeca/useGovernor';
import { useMinBalanceRentExempt } from '@/hooks/tribeca/useMinBalanceRentExempt';
import {
    useBatchedEscrowHistories,
    useBatchedLockerHistories,
} from '@/utils/tribeca/parsers';
import { useEnvironment } from '@/hooks/tribeca/useEnvironment';


// Constants
const CURRENT_ERA = calculateEra(new Date())
const ERAS_TO_FETCH = Array(5).fill(null).map((_, i) => i + CURRENT_ERA)

const LOCKER_HISTORY_SIZE = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
    SNAPSHOTS_CODERS.Snapshots.idl.accounts[0]
)

const ESCROW_HISTORY_SIZE = SNAPSHOTS_CODERS.Snapshots.coder.accounts.size(
    SNAPSHOTS_CODERS.Snapshots.idl.accounts[1]
)

// Helper Functions
export function calculatePeriod(eraStart: Date, date: Date): number {
    return Math.floor(
        (date.getTime() - eraStart.getTime()) / 1_000 / PERIOD_SECONDS
    )
}

// Hook para historias del locker
export function useLockerHistories(
    locker: PublicKey | null | undefined,
    eras: readonly number[]
) {
    const { data: lockerHistoryKeys } = useQuery({
        queryKey: ['lockerHistoryKeys', locker?.toString(), ...eras],
        queryFn: async () => {
            if (!locker) return locker
            return Promise.all(
                eras.map(async (era) => {
                    const [lockerHistory] = await findLockerHistoryAddress(locker, era)
                    return lockerHistory
                })
            )
        },
    })
    return useBatchedLockerHistories(lockerHistoryKeys as PublicKey[])
}

// Hook para historias del escrow
export function useEscrowHistories(
    escrow: PublicKey | null | undefined,
    eras: readonly number[]
) {
    const { data: escrowHistoryKeys } = useQuery({
        queryKey: ['escrowHistoryKeys', escrow?.toString(), ...eras],
        queryFn: async () => {
            if (!escrow) {
                return escrow;
            }
            return await Promise.all(
                eras.map(async (era) => {
                    const [escrowHistory] = await findEscrowHistoryAddress(escrow, era);
                    return escrowHistory;
                })
            );
        },
    });
    return useBatchedEscrowHistories(escrowHistoryKeys as PublicKey[]);
}

// Hook principal
export function useSnapshotHistories(owner?: PublicKey) {
    const { lockerData } = useGovernor()
    const { escrowKey, escrow } = useEscrow(owner)

    // Calculate eras
    const lastEra = escrow
        ? calculateEra(tsToDate(escrow.escrow.escrowEndsAt))
        : null
    const eras = lastEra !== null
        ? ERAS_TO_FETCH.filter((era) => era <= lastEra)
        : ERAS_TO_FETCH

    // Get histories
    const { data: lockerHistories } = useLockerHistories(
        lockerData?.publicKey ?? null,
        eras
    )
    const { data: escrowHistories } = useEscrowHistories(escrowKey, eras)


    const missingLockerHistoriesCount = lockerHistories
        ? lockerHistories.filter((lh) => lh === null).length
        : lockerHistories;
    const missingEscrowHistoriesCount = escrowHistories
        ? escrowHistories.filter((lh) => lh === null).length
        : escrowHistories;

    const unsyncedSnapshots = useMemo(() => {
        if (!escrow) {
            return escrow;
        }
        if (!lockerData) {
            return lockerData;
        }

        const nextPeriod = new Date(Date.now() + PERIOD_SECONDS * 1_000);
        const escrowStart = tsToDate(escrow.escrow.escrowStartedAt);
        const historyStart = nextPeriod > escrowStart ? nextPeriod : escrowStart;
        const escrowEnd = tsToDate(escrow.escrow.escrowEndsAt);
        const erasToSync = eras.map((era, i) => {
            const eraStart = calculateEraStart(era);
            const eraEnd = calculateEraStart(era + 1);
            const escrowHistory = escrowHistories?.[i];
            if (!escrowHistory) {
                return era;
            }

            let firstPeriod = -1;
            if (historyStart < eraEnd) {
                if (historyStart >= eraStart) {
                    firstPeriod = calculatePeriod(eraStart, historyStart);
                } else {
                    firstPeriod = 0;
                }
            }

            let lastPeriod = -1;
            if (escrowEnd >= eraStart) {
                if (escrowEnd < eraEnd) {
                    lastPeriod = calculatePeriod(eraStart, escrowEnd);
                } else {
                    lastPeriod = ERA_NUM_PERIODS - 1;
                }
            }

            // not in scope
            if (firstPeriod === -1 || lastPeriod === -1) {
                return null;
            }

            const { maxStakeDuration, maxStakeVoteMultiplier } =
                lockerData.account.params;

            const firstPeriodStart = calculatePeriodStart(era, firstPeriod);
            const lastPeriodStart = calculatePeriodStart(era, lastPeriod);

            const firstDuration = Math.floor(
                (firstPeriodStart.getTime() - escrowStart.getTime()) / 1_000
            );
            const firstPower = escrow.escrow.amount
                .mul(new BN(maxStakeVoteMultiplier))
                .mul(maxStakeDuration.sub(new BN(firstDuration)))
                .div(maxStakeDuration);

            const lastDuration = Math.floor(
                (lastPeriodStart.getTime() - escrowStart.getTime()) / 1_000
            );
            const lastPower = escrow.escrow.amount
                .mul(new BN(maxStakeVoteMultiplier))
                .mul(maxStakeDuration.sub(new BN(lastDuration)))
                .div(maxStakeDuration);

            const realFirstPower = escrowHistory.account.veBalances[firstPeriod];
            const realLastPower = escrowHistory.account.veBalances[lastPeriod];

            // mismatch: should refresh this
            if (
                !realFirstPower ||
                !realLastPower ||
                !firstPower.eq(realFirstPower) ||
                !lastPower.eq(realLastPower)
            ) {
                return era;
            }

            return null;
        });

        return erasToSync.filter(isNotNull);
    }, [eras, escrow, escrowHistories, lockerData]);

    const { data: lockerHistoryCost } =
        useMinBalanceRentExempt({ size: LOCKER_HISTORY_SIZE });
    const { data: escrowHistoryCost } =
        useMinBalanceRentExempt({ size: ESCROW_HISTORY_SIZE });

    const { network } = useEnvironment();
    const estimatedCost = useMemo((): TokenAmount | undefined => {
        if (
            missingLockerHistoriesCount === undefined ||
        missingEscrowHistoriesCount === undefined
        ) {
            return undefined;
        }
        const sol = RAW_SOL[network];
        let total: TokenAmount = new TokenAmount(sol, 0);
        if (lockerHistoryCost && missingLockerHistoriesCount) {
            total = total.add(
                new TokenAmount(
                    sol,
                    JSBI.multiply(
                        lockerHistoryCost.raw,
                        JSBI.BigInt(missingLockerHistoriesCount)
                    )
                )
            );
        }
        if (escrowHistoryCost && missingEscrowHistoriesCount) {
            total = total.add(
                new TokenAmount(
                    sol,
                    JSBI.multiply(
                        escrowHistoryCost.raw,
                        JSBI.BigInt(missingEscrowHistoriesCount)
                    )
                )
            );
        }
        return total;
    }, [
        escrowHistoryCost,
        lockerHistoryCost,
        missingEscrowHistoriesCount,
        missingLockerHistoriesCount,
        network,
    ]);

    const hasMissingHistories = useMemo(() => {
        return (
            !lockerHistories ||
            !escrowHistories ||
            !lockerHistories.every((lh) => lh !== null) ||
            !escrowHistories.every((eh) => eh !== null)
        );
    }, [lockerHistories, escrowHistories]);

    return {
        lockerHistories,
        escrowHistories,
        eras,
        lockerKey: lockerData?.publicKey,
        escrowKey,
        escrow,
        hasMissingHistories,
        missingLockerHistoriesCount,
        missingEscrowHistoriesCount,
        estimatedCost,
        unsyncedSnapshots,
    };
}

// Funciones de utilidad para transacciones
export async function syncSnapshots({
    provider,
    locker,
    escrow,
    eras,
}: {
    provider: AugmentedProvider
    locker: PublicKey
    escrow: PublicKey
    eras: readonly number[]
}): Promise<readonly TransactionEnvelope[]> {
    const sdk = SnapshotsSDK.load({ provider });
    const keys = await Promise.all(
        eras.map(async (era) => {
            const [lockerHistory] = await findLockerHistoryAddress(locker, era);
            const [escrowHistory] = await findEscrowHistoryAddress(escrow, era);
            return { lockerHistory, escrowHistory };
        })
    );
    return zip(eras, keys).map(([era, lockerAndEscrow]): TransactionEnvelope => {
        invariant(typeof era === 'number')
        invariant(lockerAndEscrow)
        const { lockerHistory, escrowHistory } = lockerAndEscrow
        return provider.newTX([
            sdk.snapshots.program.instruction.sync({
                accounts: {
                    locker,
                    escrow,
                    lockerHistory,
                    escrowHistory,
                },
            }),
        ]);
    });
}
  
/**
 * Creates and syncs all snapshots for an escrow.
 * @returns {@link TransactionEnvelope}s to execute in parallel.
 */
export async function createAndSyncSnapshots({
    provider,
    refetchMany,
    locker,
    escrow,
    eras,
}: {
    provider: AugmentedProvider
    refetchMany: (keys: readonly PublicKey[]) => Promise<(AccountInfo<Buffer> | Error | null)[]>
    locker: PublicKey
    escrow: PublicKey
    eras: readonly number[]
}): Promise<{
    createTXs: readonly TransactionEnvelope[]
    syncTXs: readonly TransactionEnvelope[]
}> {
    const sdk = SnapshotsSDK.load({ provider });
    const keys = await Promise.all(
        eras.map(async (era) => {
            const [lockerHistory] = await findLockerHistoryAddress(locker, era);
            const [escrowHistory] = await findEscrowHistoryAddress(escrow, era);
            return { lockerHistory, escrowHistory };
        })
    );
    // figure out which ones haven't been created yet
    const fetched = await refetchMany(
        keys.flatMap((k) => [k.lockerHistory, k.escrowHistory])
    );
    const result = zip(eras, keys, chunk(fetched, 2)).map(
        ([era, lockerAndEscrow, histories]): {
        createTX: TransactionEnvelope;
        syncTX: TransactionEnvelope;
      } => {
            invariant(typeof era === 'number')
            invariant(lockerAndEscrow && histories)
            const { lockerHistory, escrowHistory } = lockerAndEscrow
            const [lockerHistoryData, escrowHistoryData] = histories
            const ixs: TransactionInstruction[] = []
            if (lockerHistoryData === null) {
                ixs.push(
                    sdk.snapshots.program.instruction.createLockerHistory(era, {
                        accounts: {
                            locker,
                            lockerHistory,
                            payer: provider.walletKey,
                            systemProgram: SystemProgram.programId,
                        },
                    })
                );
            }
            if (escrowHistoryData === null) {
                ixs.push(
                    sdk.snapshots.program.instruction.createEscrowHistory(era, {
                        accounts: {
                            escrow,
                            escrowHistory,
                            payer: provider.walletKey,
                            systemProgram: SystemProgram.programId,
                        },
                    })
                );
            }
            return {
                createTX: provider.newTX(ixs),
                syncTX: provider.newTX([
                    sdk.snapshots.program.instruction.sync({
                        accounts: {
                            locker,
                            escrow,
                            lockerHistory,
                            escrowHistory,
                        },
                    }),
                ]),
            };
        }
    );
    return {
        createTXs: TransactionEnvelope.pack(...result.map((res) => res.createTX)),
        syncTXs: result.map((res) => res.syncTX),
    };
}