'use client'

import { useAccountData, usePubkey, useToken } from '@rockooor/sail';
import { Token, TokenAmount } from '@saberhq/token-utils';
import type { PublicKey } from '@solana/web3.js';
import type { GovernorConfig } from '@tribecahq/registry';
import { GovernorWrapper } from '@tribecahq/tribeca-sdk';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createContainer } from 'unstated-next';
import { loadGovernorConfig } from '@tribecahq/registry';

import { useSDK } from '@/contexts/tribeca/sdk';
import { formatDurationSeconds } from '@/utils/tribeca/format';
import { useGovernorData, useLockerData } from '@/utils/tribeca/parsers';
import { useGovernanceManifest } from '@/hooks/tribeca/api/useGovernanceManifest';
import { useTribecaRegistry } from '@/hooks/tribeca/api/useTribecaRegistry';
import { useWindowTitle } from '@/hooks/tribeca/useWindowTitle';

export interface GaugeSettings {
  gaugemeister: PublicKey;
}

export type GovernorInfo = (
  | {
      key: PublicKey;
      meta: GovernorConfig | null;
      slug: string;
      loading: boolean;
    }
  | {
      key: PublicKey | null;
      meta: GovernorConfig | null;
      slug: string;
      loading: true;
    }
) & {
  gauge: GaugeSettings | null;
  manifest: GovernorConfig | null | undefined;
};

export function useGovernorInfo(): GovernorInfo | null {
    const params = useParams();
    const daoStr = (params?.dao as string) ?? '';
    const { data: governorMetas, isLoading, isFetched } = useTribecaRegistry();

    const governorMeta = useMemo(
        () => {
            const found = governorMetas?.find(
                (gov) =>
                    gov.address.toString() === daoStr || gov.slug === daoStr
            )
            return found ? loadGovernorConfig(found) : null
        },
        [governorMetas, daoStr]
    );

    const slug = governorMeta?.slug ?? daoStr;
    
    const {
        data: manifest,
        isLoading: mfIsLoading,
        isFetched: mfIsFetched,
    } = useGovernanceManifest(slug);
    
    const key = usePubkey(governorMeta?.address ?? daoStr);
    console.log('key:', key)
    
    const gaugemeister = usePubkey(governorMeta?.gauge?.gaugemeister);

    const loading = isLoading || !isFetched || mfIsLoading || !mfIsFetched;
    if (loading && !key) {
        return {
            key: null,
            meta: governorMeta,
            manifest,
            slug,
            loading: true,
            gauge: null,
        };
    }

    if (!key) {
        return null;
    }

    return {
        key,
        meta: governorMeta,
        slug,
        manifest,
        loading,
        gauge: gaugemeister ? { gaugemeister } : null,
    };
}

function useGovernorInner() {
    const info = useGovernorInfo()
    if (!info) {
        throw new Error('governor not found')
    }
    const { meta, key: governor, slug, gauge, manifest } = info
    console.log('governor:', governor)
    if (!governor) {
        throw new Error('Governor not loaded.')
    }
    const path = `/gov/${slug}`

    const { data: govDataRaw } = useAccountData(governor);
    const { data: parsedGovernorData } = useGovernorData(governor);

    const governorData =
        govDataRaw === undefined ? undefined : parsedGovernorData;
    
    let lockerAddress: PublicKey | undefined | null
    if (governorData) {
        lockerAddress = governorData.account.electorate
    } else {
        lockerAddress = undefined
    }
    const { data: lockerData } = useLockerData(lockerAddress)

    let backupGovTokenAddress: PublicKey | undefined | null
    if (lockerData) {
        backupGovTokenAddress = lockerData.account.tokenMint
    } else {
        backupGovTokenAddress = undefined
    }
    const { data: backupGovToken } = useToken(
        backupGovTokenAddress
    );

    const govToken = meta?.govToken ? new Token(meta.govToken) : backupGovToken;
    const veToken = govToken
        ? new Token({
            ...govToken.info,
            name: `Voting Escrow ${govToken.name}`,
            symbol: `ve${govToken.symbol}`,
        })
        : govToken;

    const iconURL = meta?.iconURL ?? govToken?.icon;

    const minActivationThreshold =
        veToken && lockerData
            ? new TokenAmount(
                veToken,
                lockerData.account.params.proposalActivationMinVotes
            )
            : null;

    const lockedSupply =
        govToken && lockerData
            ? new TokenAmount(govToken, lockerData.account.lockedSupply)
            : govToken === undefined && lockerData === undefined
                ? undefined
                : null;

    const proposalCount = governorData
        ? governorData.account.proposalCount.toNumber()
        : governorData;

    const { tribecaMut } = useSDK();
    const governorW = useMemo(
        () => (tribecaMut ? new GovernorWrapper(tribecaMut, governor) : null),
        [governor, tribecaMut]
    );

    const smartWallet = governorData
        ? governorData.account.smartWallet
        : governorData;

    return {
        meta,
        manifest,
        daoName: meta?.name ?? govToken?.name.split(' ')[0],
        path,
        governor,
        governorW,
        governorData,
        lockerData,
        govToken,
        veToken,
        minActivationThreshold,
        lockedSupply,
        proposalCount,
        smartWallet,
        iconURL,
        gauge,
    };
}

export function useGovernorParams() {
    const { governorData, veToken } = useGovernor()
    const votesForQuorum =
        governorData && veToken
            ? new TokenAmount(veToken, governorData.account.params.quorumVotes)
            : null
    const votingPeriodFmt = governorData
        ? formatDurationSeconds(governorData.account.params.votingPeriod.toNumber())
        : null
    return { votesForQuorum, votingPeriodFmt }
}

export const { useContainer: useGovernor, Provider: GovernorProvider } =
    createContainer(useGovernorInner)

export function useGovWindowTitle(title: string) {
    const { daoName } = useGovernor()
    useWindowTitle(daoName ? `${daoName} | ${title}` : 'Loading...')
}
