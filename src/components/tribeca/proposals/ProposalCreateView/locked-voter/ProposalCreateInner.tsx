'use client'

import {
    extractErrorMessage,
    useAccountData,
    useTXHandlers,
} from '@rockooor/sail';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil';
import {
    useGovernor,
    useGovWindowTitle,
} from '@/hooks/tribeca/useGovernor';
import { useWrapTx } from '@/hooks/tribeca/useWrapTx';
import { AsyncButton } from '@/components/tribeca/AsyncButton';
import { Button } from '@/components/tribeca/Button';
import { Card } from '@/components/tribeca/Card';
import { HelperCard } from '@/components/tribeca/HelperCard';
import { InputText, Textarea } from '@/components/tribeca/inputs/InputText';
import { LabeledInput } from '@/components/tribeca/inputs/LabeledInput';
import { ProposalConfirmModal } from './ProposalConfirmationModal';
import { ProposalTXForm } from './ProposalTXForm';


function ProposalCreateInner() {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [discussionLink, setDiscussionLink] = useState<string>('')
    const [txRaw, setTxRaw] = useState<string>('')
    const [theError, setError] = useState<string | null>(null)
    const { minActivationThreshold, manifest } = useGovernor()
    const { signAndConfirmTX } = useTXHandlers()
    const { wrapTx } = useWrapTx()
    useGovWindowTitle('Create Proposal')

    const proposalCfg = manifest?.proposals
    const discussionRequired = !!proposalCfg?.discussion?.required

    const { tx, error: parseError } = useMemo(() => {
        try {
            const buffer = Buffer.from(txRaw, 'base64')
            const tx = Transaction.from(buffer)
            if (tx.instructions.length === 0) {
                return { error: 'Transaction cannot be empty' }
            }
            return { tx }
        } catch (e) {
            return {
                error: extractErrorMessage(e),
            }
        }
    }, [txRaw])

    const error =
        discussionRequired && !discussionLink
            ? 'Discussion link is required'
            : proposalCfg?.discussion?.prefix &&
              !discussionLink.startsWith(proposalCfg.discussion.prefix)
                ? 'Invalid discussion link'
                : theError ?? parseError

    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const { ownerInvokerKey } = useExecutiveCouncil()

    const payerMut =
        !!ownerInvokerKey &&
        !!tx?.instructions
            .flatMap((ix) => ix.keys)
            .find(
                (meta) =>
                    meta.pubkey.equals(ownerInvokerKey) &&
                    meta.isWritable &&
                    meta.isSigner
            )
            ? ownerInvokerKey
            : null

    const { data: payerMutData } = useAccountData(payerMut)
    const currentPayerBalance =
        payerMutData === undefined
            ? undefined
            : (payerMutData?.accountInfo.lamports ?? 0) / LAMPORTS_PER_SOL

    return (
        <>
            <ProposalConfirmModal
                isOpen={showConfirm}
                onDismiss={() => setShowConfirm(false)}
                proposal={{
                    title,
                    description: discussionLink
                        ? `${description}\n\n[View Discussion](${discussionLink})`
                        : description,
                    instructions: tx?.instructions ?? [],
                }}
            />
            <div className="flex flex-col gap-8 md:grid" style={{ gridTemplateColumns: '400px 1fr' }}>
                <div>
                    <Card title="Proposal Info">
                        <div className="grid gap-4 px-7 py-6">
                            <HelperCard variant="muted">
                                <div className="leading-loose">
                                    <p className="text-white mb-2">You are creating a proposal draft.</p>
                                    <p>
                                        If activated by a a DAO member with at least{' '}
                                        <strong>{minActivationThreshold?.formatUnits()}</strong>,
                                        the members of the DAO may vote to execute or reject the
                                        proposal.
                                    </p>
                                </div>
                            </HelperCard>
                            {proposalCfg?.notice && (
                                <HelperCard variant="primary">
                                    <div className="[&>p]:mb-2 [&>a]:text-white [&>a:hover]:underline">
                                        <ReactMarkdown>{proposalCfg.notice}</ReactMarkdown>
                                    </div>
                                </HelperCard>
                            )}
                            <label className="flex flex-col gap-1" htmlFor="title">
                                <span className="text-sm">Title (max 140 characters)</span>
                                <InputText
                                    id="title"
                                    placeholder="A short summary of your proposal."
                                    value={title}
                                    maxLength={140}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                            <label className="flex flex-col gap-1" htmlFor="description">
                                <span className="text-sm">Description (max 750 characters)</span>
                                <Textarea
                                    id="description"
                                    className="h-auto"
                                    rows={4}
                                    maxLength={750}
                                    placeholder={'## Summary\nYour proposal will be formatted using Markdown.'}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </label>
                            {proposalCfg?.discussion?.required && (
                                <LabeledInput
                                    Component={InputText}
                                    id="discussionLink"
                                    required
                                    label="Link to discussion (required)"
                                    placeholder={`URL must start with "${
                                        proposalCfg?.discussion.prefix ?? ''
                                    }"`}
                                    type="text"
                                    value={discussionLink}
                                    onChange={(e) => setDiscussionLink(e.target.value)}
                                    error={
                                        !discussionLink.startsWith(
                                            proposalCfg.discussion.prefix ?? ''
                                        )
                                            ? 'Invalid discussion link'
                                            : undefined
                                    }
                                    touched={true}
                                />
                            )}
                        </div>
                    </Card>
                </div>
                <div className="flex flex-col gap-4">
                    <Card title="Proposal Action">
                        <div className="grid gap-4 px-7 py-6">
                            <ProposalTXForm
                                setError={setError}
                                txRaw={txRaw}
                                setTxRaw={setTxRaw}
                            />
                        </div>
                    </Card>
                    <div className="flex gap-4">
                        {payerMut &&
                            currentPayerBalance !== undefined &&
                            currentPayerBalance < 0.5 && (
                            <AsyncButton
                                className="flex-1"
                                size="md"
                                onClick={async ({ provider }) => {
                                    await signAndConfirmTX(
                                        await wrapTx(
                                            provider.newTX([
                                                SystemProgram.transfer({
                                                    fromPubkey: provider.walletKey,
                                                    toPubkey: payerMut,
                                                    lamports: LAMPORTS_PER_SOL,
                                                }),
                                            ])
                                        )
                                    )
                                }}
                            >
                                <div className="flex flex-col">
                                    <span>Fund with 1 SOL</span>
                                    <span className="text-xs">
                                        (payer balance: {currentPayerBalance.toLocaleString()}{' '}
                                        SOL)
                                    </span>
                                </div>
                            </AsyncButton>
                        )}
                        <Button
                            className="flex-1"
                            size="md"
                            type="button"
                            disabled={!(tx && title && description) || !!error}
                            variant="primary"
                            onClick={() => setShowConfirm(true)}
                        >
                            {error ? error : 'Preview Proposal'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export { ProposalCreateInner }