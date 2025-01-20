'use client';

import { Switch } from '@headlessui/react';
import type { Alert, TargetGroup } from '@notifi-network/notifi-core';
import {
    BlockchainEnvironment,
    useNotifiClient,
} from '@notifi-network/notifi-react-hooks';
import type { Network } from '@saberhq/solana-contrib';
import type { MessageSignerWalletAdapterProps } from '@solana/wallet-adapter-base';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useEnvironment } from '@/hooks/tribeca/useEnvironment';
import { SubscriptionCard } from './SubscriptionCard';
import { SubscriptionFormContainer } from './SubscriptionFormContainer';
import { SubscriptionGlimmer } from './SubscriptionGlimmer';
import { SubscriptionInfo } from './SubscriptionInfo';

interface Props {
    daoName: string;
    governor: string;
    walletPublicKey: string;
    signer: MessageSignerWalletAdapterProps;
}

const getBlockchainEnvironment = (network: Network): BlockchainEnvironment => {
    switch (network) {
    case 'mainnet-beta':
        return BlockchainEnvironment.MainNetBeta;
    case 'devnet':
        return BlockchainEnvironment.DevNet;
    case 'testnet':
        return BlockchainEnvironment.TestNet;
    default:
    case 'localnet':
        return BlockchainEnvironment.LocalNet;
    }
};

type VisibilityState = Readonly<{
    isEditing: boolean;
    needsRefresh: boolean;
    isToggleVisible: boolean;
}>

export function SubscriptionPopover({
    daoName,
    governor,
    walletPublicKey,
    signer,
}: Props) {
    const { network } = useEnvironment();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [phone, setPhoneRaw] = useState<string>('');
    const [visibilityState, setVisibilityState] = useState<VisibilityState>({
        isEditing: false,
        needsRefresh: false,
        isToggleVisible: false,
    });

    const setPhone = useCallback(
        (value: string): void => {
            if (value?.startsWith('+') && value?.length > 1) {
                setPhoneRaw(value.substring(2));
            } else {
                setPhoneRaw(value ?? '');
            }
        },
        [setPhoneRaw]
    );

    const env = getBlockchainEnvironment(network);

    const {
        data,
        createAlert,
        deleteAlert,
        expiry,
        fetchData,
        isInitialized,
        loading,
        logIn,
        isAuthenticated,
    } = useNotifiClient({
        dappAddress: governor,
        walletPublicKey,
        env,
        walletBlockchain: 'SUI',
        accountAddress: walletPublicKey,
    });

    const { alert, targetGroup } = useMemo(() => {
        let alert: Alert | null = null;
        let targetGroup: TargetGroup | null = null;
        if (data !== null) {
            const { alerts, targetGroups } = data;
            alert = alerts[0] ?? null;
            targetGroup = targetGroups[0] ?? null;
        }

        return {
            alert,
            targetGroup,
        };
    }, [data]);

    useEffect(() => {
        if (targetGroup !== null) {
            const emailTarget = targetGroup.emailTargets[0];
            setEmail(emailTarget?.emailAddress ?? '');

            const smsTarget = targetGroup.smsTargets[0];
            setPhone(smsTarget?.phoneNumber ?? '');
        }
    }, [targetGroup, setEmail, setPhone]);

    useEffect(() => {
        const newIsSubscribed = alert !== null;
        setIsSubscribed(newIsSubscribed);
    }, [alert]);

    useEffect(() => {
        if (isInitialized) {
            const hasLoggedIn = expiry !== null;
            if (hasLoggedIn) {
                const expiryDate = new Date(expiry);
                const now = new Date();
                const needsRefresh = expiryDate < now;
                setVisibilityState({
                    isEditing: needsRefresh,
                    needsRefresh: needsRefresh,
                    isToggleVisible: true,
                });
            } else {
            // First time user
                setVisibilityState({
                    isEditing: true,
                    needsRefresh: false,
                    isToggleVisible: false,
                });
            }
        }
    }, [expiry, isInitialized]);

    const refreshLogin = useCallback(async () => {
        await logIn({
            walletBlockchain: 'SUI',
            signMessage: signer.signMessage,
        });
        setVisibilityState({
            isEditing: false,
            needsRefresh: false,
            isToggleVisible: true,
        });
    }, [logIn, signer]);

    const doCreateAlert = useCallback(async () => {
        if ('' === email && '' === phone) {
            // TODO: surface validation error
            return;
        }

        if (!isAuthenticated) {
            await logIn({
                walletBlockchain: 'SUI',
                signMessage: signer.signMessage,
            });
        }

        const data = await fetchData();
        const existingAlert = data.alerts.find((it) => it.name === governor);
        if (existingAlert && existingAlert.id) {
            await deleteAlert({
                alertId: existingAlert.id,
                keepSourceGroup: true,
                keepTargetGroup: true,
            });
        }

        const filterId = data.filters[0]?.id ?? null;
        const sourceId = data.sources[0]?.id ?? null;
        if (filterId === null || sourceId === null) {
            throw new Error('Invalid Notifi Data! Please try again');
        }

        await createAlert({
            name: governor,
            sourceId,
            filterId,
            emailAddress: email === '' ? null : email,
            phoneNumber: phone === '' ? null : `+1${phone}`,
            telegramId: null,
            includeDiscord: false,
        });

        setVisibilityState({
            isEditing: false,
            needsRefresh: false,
            isToggleVisible: true,
        });
    }, [
        createAlert,
        deleteAlert,
        email,
        fetchData,
        governor,
        isAuthenticated,
        logIn,
        phone,
        signer,
    ]);

    const toggleAlert = useCallback(async () => {
        const alertId = alert?.id ?? null;
        if (alertId !== null) {
            await deleteAlert({
                alertId,
                keepSourceGroup: true,
                keepTargetGroup: true,
            });
        } else {
            await doCreateAlert();
        }
    }, [alert, deleteAlert, doCreateAlert]);

    let component = <SubscriptionGlimmer />;
    if (isInitialized) {
        component = visibilityState.isEditing ? (
            visibilityState.needsRefresh ? (
                <SubscriptionFormContainer
                    email={email}
                    inputDisabled={true}
                    submitDisabled={loading}
                    submitLabel="Refresh"
                    phone={phone}
                    setEmail={setEmail}
                    setPhone={setPhone}
                    submit={refreshLogin}
                    warningMessage="Your login has expired. Sign a message to refresh your login."
                />
            ) : (
                <SubscriptionFormContainer
                    inputDisabled={loading}
                    submitDisabled={loading}
                    submitLabel="Subscribe"
                    email={email}
                    phone={phone}
                    setEmail={setEmail}
                    setPhone={setPhone}
                    submit={doCreateAlert}
                />
            )
        ) : (
            <SubscriptionInfo
                email={email}
                phone={phone}
                edit={() => {
                    setVisibilityState({
                        ...visibilityState,
                        isEditing: true,
                    });
                }}
            />
        );
    }

    return (
        <SubscriptionCard
            body={component}
            switchGroup={
                visibilityState.isToggleVisible ? (
                    <Switch.Group>
                        <div className='flex items-center justify-between py-2 px-4 border-b text-sm dark:border-warmGray-800'>
                            <Switch.Label className='font-medium text-warmGray-400'>
                                {daoName} Notifications
                            </Switch.Label>
                            <Switch
                                disabled={loading}
                                checked={isSubscribed}
                                onChange={toggleAlert}
                                className={`
                                    relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                                    ${isSubscribed ? 'bg-saber' : 'bg-warmGray-600'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                                        ${isSubscribed ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </Switch>
                        </div>
                    </Switch.Group>
                ) : undefined
            }
        />
    );
}
