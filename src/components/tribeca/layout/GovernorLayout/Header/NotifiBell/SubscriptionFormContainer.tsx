'use client';

import { useUserEscrow } from '@/hooks/tribeca/useEscrow';
import { useGovernorInfo } from '@/hooks/tribeca/useGovernor';
import type { Props } from './SubscriptionForm';
import { SubscriptionForm } from './SubscriptionForm';
import { SubscriptionGlimmer } from './SubscriptionGlimmer';

export function SubscriptionFormContainer(props: Props) {
    const info = useGovernorInfo();

    const manifest = info?.manifest;
    const loading = info?.loading ?? true;

    return loading || !manifest ? (
        <SubscriptionGlimmer />
    ) : (
        <LockedVoterSubscriptionForm {...props} />
    );
}

function LockedVoterSubscriptionForm({
    inputDisabled,
    submitDisabled,
    warningMessage,
    ...rest
}: Props) {
    const { isEscrowLoading, veBalance, isLoading } = useUserEscrow();
    const localDisabled = !veBalance || veBalance.asNumber <= 0;
    const localWarningMessage = localDisabled
        ? 'You need voting power to subscribe'
        : warningMessage;

    return isEscrowLoading || isLoading ? (
        <SubscriptionGlimmer />
    ) : (
        <SubscriptionForm
            inputDisabled={localDisabled || inputDisabled}
            submitDisabled={localDisabled || submitDisabled}
            warningMessage={localWarningMessage}
            {...rest}
        />
    );
}
