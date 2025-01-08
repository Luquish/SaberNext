import { useState } from 'react';

import type { ActionType } from '@/actions/tribeca/types';
import { ACTIONS } from '@/actions/tribeca/types';
import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil';
import { useGovernor } from '@/hooks/tribeca/useGovernor';
import { HelperCard } from '@/components/tribeca/HelperCard';
import { Select } from '@/components/tribeca/inputs/InputText';
import { LoadingPage } from '@/components/tribeca/LoadingPage';
import { PublicKey } from '@solana/web3.js';

interface Props {
  txRaw: string;
  setError: (error: string | null) => void;
  setTxRaw: (txRaw: string) => void;
}

export const ProposalTXForm: React.FC<Props> = ({
    setError,
    txRaw,
    setTxRaw,
}: Props) => {
    const [actionType, setActionType] = useState<ActionType>('Upgrade Program');
    const { meta, smartWallet, lockerData, governor } = useGovernor();
    const { ownerInvokerKey } = useExecutiveCouncil();

    if (!smartWallet || !ownerInvokerKey) {
        return <LoadingPage />;
    }

    const actor = smartWallet;
    const finalActor = actor instanceof PublicKey ? actor : actor.account.electorate;
    const ctx = { ...meta, locker: lockerData?.publicKey, governor };

    const currentAction = ACTIONS.find((action) => action.title === actionType);

    return (
        <div tw='grid gap-4'>
            <label tw='flex flex-col gap-1' htmlFor='proposedAction'>
                <span tw='text-sm'>Proposed Action</span>
                <Select
                    value={actionType}
                    onChange={(e) => {
                        setActionType(e.target.value as ActionType);
                        setError(null);
                        setTxRaw('');
                    }}
                >
                    {ACTIONS.map(({ title, isEnabled }) => {
                        if (isEnabled && ctx && !isEnabled(ctx)) {
                            return null;
                        }
                        return (
                            <option key={title} value={title}>
                                {title}
                            </option>
                        );
                    })}
                </Select>
            </label>
            {currentAction && (
                <>
                    {currentAction.description && (
                        <HelperCard>{currentAction.description}</HelperCard>
                    )}
                    <currentAction.Renderer
                        actor={finalActor}
                        payer={ownerInvokerKey}
                        ctx={ctx}
                        txRaw={txRaw}
                        setError={setError}
                        setTxRaw={setTxRaw}
                    />
                </>
            )}
        </div>
    );
};
