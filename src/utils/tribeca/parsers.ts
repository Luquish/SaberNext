'use client'

import { GOKI_CODERS } from '@gokiprotocol/client';
import { GAUGE_CODERS } from '@quarryprotocol/gauge';
import { QUARRY_CODERS } from '@quarryprotocol/quarry-sdk';
import { makeParserHooks, makeProgramParserHooks } from '@rockooor/sail';
import { SABER_CODERS } from '@saberhq/saber-periphery';
import { SNAPSHOTS_CODERS } from '@saberhq/snapshots';
import { SAVE_CODERS } from '@tribecahq/save';
import { TRIBECA_CODERS } from '@tribecahq/tribeca-sdk';
// import { VENKO_CODERS } from '@venkoapp/venko';

/**
 * Combined parser hooks for all protocols
 */

const parserHooks = makeParserHooks({
    ...TRIBECA_CODERS.Govern.accountParsers,
    ...TRIBECA_CODERS.LockedVoter.accountParsers,
    ...GOKI_CODERS.SmartWallet.accountParsers,
    ...GAUGE_CODERS.Gauge.accountParsers,
    ...QUARRY_CODERS.Mine.accountParsers,
    ...QUARRY_CODERS.Operator.accountParsers,
    ...QUARRY_CODERS.MintWrapper.accountParsers,
    // ...VENKO_CODERS.Venko.accountParsers,
});

/**
 * Tribeca governance hooks
 */

export const {
    proposal: { useData: useParsedProposals, useSingleData: useParsedProposal },
    proposalMeta: {
        useData: useParsedProposalMetas,
        useSingleData: useParsedProposalMeta,
    },
    locker: { useData: useParsedLockers, useSingleData: useParsedLocker },
    escrow: { useData: useParsedEscrows, useSingleData: useParsedEscrow },
    governor: { useData: useParsedGovernors, useSingleData: useParsedGovernor },
    vote: { useData: useParsedVotes, useSingleData: useParsedVote },
    transaction: { useData: useParsedTXByKeys, useSingleData: useParsedTXByKey },
    gaugemeister: {
        useData: useParsedGaugemeisters,
        useSingleData: useParsedGaugemeister,
    },
    gauge: { useData: useParsedGauges, useSingleData: useParsedGauge },
    gaugeVoter: {
        useData: useParsedGaugeVoters,
        useSingleData: useParsedGaugeVoter,
    },
    gaugeVote: {
        useData: useParsedGaugeVotes,
        useSingleData: useParsedGaugeVote,
    },
    epochGauge: {
        useData: useParsedEpochGauges,
        useSingleData: useParsedEpochGauge,
    },
    epochGaugeVote: {
        useData: useParsedEpochGaugeVotes,
        useSingleData: useParsedEpochGaugeVote,
    },
    epochGaugeVoter: {
        useData: useParsedEpochGaugeVoters,
        useSingleData: useParsedEpochGaugeVoter,
    },
    rewarder: { useData: useParsedRewarders, useSingleData: useParsedRewarder },
    quarry: { useData: useParsedQuarries, useSingleData: useParsedQuarry },
    operator: { useData: useParsedOperators, useSingleData: useParsedOperator },
    mintWrapper: {
        useData: useParsedMintWrappers,
        useSingleData: useParsedMintWrapper,
    },
    // stream: { useData: useParsedStreams, useSingleData: useParsedStream },
} = parserHooks;


/**
 * Tribeca program hooks
 */

export const {
    proposal: { useData: useProposalsData, useSingleData: useProposalData },
    proposalMeta: {
        useData: useProposalMetasData,
        useSingleData: useProposalMetaData,
    },
    governor: { useData: useGovernorsData, useSingleData: useGovernorData },
    vote: { useData: useVotesData, useSingleData: useVoteData },
} = makeProgramParserHooks(TRIBECA_CODERS.Govern);


/**
 * Gauge program hooks
 */

export const {
    gaugemeister: { useSingleData: useGaugemeisterData },
    gauge: {
        useBatchedData: useBatchedGauges,
        useData: useGaugesData,
        useSingleData: useGaugeData,
    },
    gaugeVoter: { useData: useGaugeVotersData, useSingleData: useGaugeVoterData },
    gaugeVote: {
        useBatchedData: useBatchedGaugeVotes,
        useData: useGaugeVotesData,
        useSingleData: useGaugeVoteData,
    },
    epochGauge: {
        useBatchedData: useBatchedEpochGauges,
        useData: useEpochGaugesData,
        useSingleData: useEpochGaugeData,
    },
    epochGaugeVote: {
        useData: useEpochGaugeVotesData,
        useSingleData: useEpochGaugeVoteData,
    },
    epochGaugeVoter: {
        useData: useEpochGaugeVotersData,
        useSingleData: useEpochGaugeVoterData,
    },
} = makeProgramParserHooks(GAUGE_CODERS.Gauge);

export const {
    subaccountInfo: {
        useData: useSubaccountInfosData,
        useBatchedData: useBatchedSubaccountInfos,
        useSingleData: useSubaccountInfoData,
    },
    transaction: {
        useData: useGokiTransactionsData,
        useBatchedData: useBatchedGokiTransactions,
        useSingleData: useGokiTransactionData,
    },
    smartWallet: { useSingleData: useGokiSmartWalletData },
} = makeProgramParserHooks(GOKI_CODERS.SmartWallet);

export const {
    escrow: { useSingleData: useEscrowData },
    locker: { useSingleData: useLockerData },
} = makeProgramParserHooks(TRIBECA_CODERS.LockedVoter);

export const {
    save: { useSingleData: useSAVEData, useBatchedData: useBatchedSAVEs },
} = makeProgramParserHooks(SAVE_CODERS.SAVE);

export const {
    lockerHistory: {
        useSingleData: useLockerHistoriesData,
        useData: useLockerHistoryData,
        useBatchedData: useBatchedLockerHistories,
    },
    escrowHistory: {
        useSingleData: useEscrowHistoriesData,
        useData: useEscrowHistoryData,
        useBatchedData: useBatchedEscrowHistories,
    },
} = makeProgramParserHooks(SNAPSHOTS_CODERS.Snapshots);

export const {
    redeemer: { useSingleData: useSaberRedeemerData },
} = makeProgramParserHooks(SABER_CODERS.Redeemer);

export const {
    minterInfo: { useSingleData: useSaberMinterInfoData },
} = makeProgramParserHooks(SABER_CODERS.MintProxy);
