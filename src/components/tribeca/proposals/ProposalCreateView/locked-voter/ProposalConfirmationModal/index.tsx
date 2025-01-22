'use client'

import { useSail } from '@rockooor/sail'
import { buildStubbedTransaction } from '@saberhq/solana-contrib'
import type { TransactionInstruction } from '@solana/web3.js'
import { GovernorWrapper } from '@tribecahq/tribeca-sdk'
import { FaExternalLinkAlt } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/navigation'
import invariant from 'tiny-invariant';

import { useSDK } from '@/contexts/tribeca/sdk';
import {
    useGovernor,
    useGovernorParams,
} from '@/hooks/tribeca/useGovernor';
import { useWrapTx } from '@/hooks/tribeca/useWrapTx';
import { notify } from '@/utils/tribeca/notifications';
import { useEnvironment } from '@/hooks/tribeca/useEnvironment';
import { HelperCard } from '@/components/tribeca/HelperCard';
import type { ModalProps } from '@/components/tribeca/Modal';
import { Modal } from '@/components/tribeca/Modal';
import { ModalInner } from '@/components/tribeca/Modal/ModalInner';
import { ProposalIX } from './ProposalIX';

type Props = Omit<ModalProps, 'children'> & {
    proposal: {
        title: string
        description: string
        instructions: TransactionInstruction[]
    }
}

export function ProposalConfirmModal({
    proposal,
    ...modalProps
}: Props) {
    const { network } = useEnvironment();
    const { tribecaMut } = useSDK();
    const { governor, path, minActivationThreshold } = useGovernor();
    const { votingPeriodFmt } = useGovernorParams();
    const { handleTX } = useSail();
    const { wrapTx } = useWrapTx();
    const router = useRouter();

    const doProposeTransaction = async () => {
        invariant(tribecaMut);
        const gov = new GovernorWrapper(tribecaMut, governor);
        const createProposal = await gov.createProposal({
            instructions: proposal.instructions,
        });
        const createProposalMetaTX = await gov.createProposalMeta({
            proposal: createProposal.proposal,
            title: proposal.title,
            descriptionLink: proposal.description,
        });
        for (const txEnv of [createProposal.tx, createProposalMetaTX]) {
            const { pending, success } = await handleTX(
                await wrapTx(txEnv),
                'Create Proposal'
            );
            if (!success || !pending) {
                return;
            }
            await pending.wait();
        }
        notify({
            message: `Proposal ${`000${createProposal.index.toString()}`.slice(
                -4
            )} created`,
        });
        router.push(`${path}/proposals/${createProposal.index.toString()}`);
        modalProps.onDismiss();
    };

    return (
        <Modal className="p-0 dark:text-white" {...modalProps}>
            <ModalInner
                title={`Proposal: ${proposal.title}`}
                buttonProps={{
                    disabled: !tribecaMut,
                    variant: 'primary',
                    onClick: doProposeTransaction,
                    children: 'Propose Transaction',
                }}
            >
                <div className="py-4 grid gap-4">
                    <HelperCard>
                        <p className="mb-1">
                        Tip: The proposal cannot be modified after submission, so please
                        verify all information before submitting.
                        </p>
                        <p>
                        Once submitted, anyone with at least{' '}
                            {minActivationThreshold?.formatUnits()} may start the voting
                        period, i.e., activate the proposal. The voting period will then
                        immediately begin and last for {votingPeriodFmt}.
                        </p>
                    </HelperCard>
                    <div className="break-words hyphens[auto]">
                        <div className="prose prose-sm prose-light">
                            <ReactMarkdown>{proposal.description}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {proposal.instructions.map((ix, i) => (
                            <ProposalIX key={i} ix={ix} />
                        ))}
                    </div>
                    {network !== 'localnet' && proposal.instructions.length > 0 && (
                        <a
                            className="text-sm text-saber hover:text-white transition-colors flex items-center gap-2"
                            href={`https://${
                                network === 'mainnet-beta' ? '' : `${network}.`
                            }anchor.so/tx/inspector?message=${encodeURIComponent(
                                buildStubbedTransaction(network, proposal.instructions)
                                    .serializeMessage()
                                    .toString('base64')
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span>Preview on Anchor.so</span>
                            <FaExternalLinkAlt />
                        </a>
                    )}
                </div>
            </ModalInner>
        </Modal>
    );
}
