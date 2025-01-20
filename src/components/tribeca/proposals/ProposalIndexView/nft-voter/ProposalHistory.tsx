'use client'

import type { SmartWalletTransactionData } from '@gokiprotocol/client'
import type { ProgramAccount } from '@project-serum/anchor'
import { ZERO } from '@quarryprotocol/quarry-sdk'
import type { ProposalData } from '@tribecahq/tribeca-sdk'
import {
    getProposalState,
    PROPOSAL_STATE_LABELS,
    ProposalState,
} from '@tribecahq/tribeca-sdk'
import BN from 'bn.js'
import { startCase } from 'lodash-es'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { Card } from '@/components/tribeca/Card'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { useGokiTransactionData } from '@/utils/tribeca/parsers'

interface Props {
    className?: string
    proposalInfo?: ProposalInfo | null
}

interface ProposalEvent {
    title: string
    date: Date
    link?: string | null
}

export const makeDate = (num: BN): Date => new Date(num.toNumber() * 1_000)

const extractEvents = (
    proposalData: ProposalData,
    tx: ProgramAccount<SmartWalletTransactionData> | null
): ProposalEvent[] => {
    const events: ProposalEvent[] = []
    
    if (!proposalData.canceledAt.eq(ZERO)) {
        events.push({ title: 'Canceled', date: makeDate(proposalData.canceledAt) })
    }
    if (!proposalData.activatedAt.eq(ZERO)) {
        events.push({
            title: 'Activated',
            date: makeDate(proposalData.activatedAt),
        })
    }
    if (!proposalData.createdAt.eq(ZERO)) {
        events.push({ title: 'Created', date: makeDate(proposalData.createdAt) })
    }
    if (!proposalData.queuedAt.eq(ZERO)) {
        const queuedDate = makeDate(proposalData.queuedAt)
        events.push({
            title: 'Queued',
            date: queuedDate,
            link: tx
                ? `https://goki.so/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
                : null,
        })

        const expiredDate = new Date(queuedDate.valueOf())
        expiredDate.setDate(expiredDate.getDate() + 14)
        if (expiredDate <= new Date() && !tx?.account.executedAt.gt(new BN(0))) {
            events.push({
                title: 'Marked as Executed',
                date: expiredDate,
            })
        }
    }
    if (
        !proposalData.votingEndsAt.eq(ZERO) &&
        makeDate(proposalData.votingEndsAt) <= new Date()
    ) {
        // TODO: update quorum
        const state = getProposalState({ proposalData })
        events.push({
            title: startCase(
                PROPOSAL_STATE_LABELS[
                    state === ProposalState.Queued ? ProposalState.Succeeded : state
                ]
            ),
            date: makeDate(proposalData.votingEndsAt),
        })
    }
    if (tx?.account.executedAt.gt(new BN(0))) {
        events.push({
            title: 'Executed',
            date: makeDate(tx.account.executedAt),
            link: tx
                ? `https://goki.so/wallets/${tx.account.smartWallet.toString()}/tx/${tx.account.index.toString()}`
                : null,
        })
    }
    return events.sort((a, b) => (a.date < b.date ? -1 : 1))
}

/**
 * Component that displays the history of events for a proposal
 */
function ProposalHistory({ className, proposalInfo }: Props) {
    const { data: tx } = useGokiTransactionData(
        !proposalInfo?.proposalData.queuedAt.eq(ZERO)
            ? proposalInfo?.proposalData.queuedTransaction
            : null
    )

    const events = proposalInfo
        ? extractEvents(proposalInfo.proposalData, tx ?? null)
        : []

    return (
        <Card className={className} title="Proposal History">
            <div className="px-7 py-4 grid gap-4">
                {events.map(({ title, date, link }, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col text-sm">
                                <span className="text-white">{title}</span>
                                <span className="text-warmGray-600 text-xs">
                                    {date.toLocaleDateString(undefined, {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}{' '}
                                    &mdash; {date.toLocaleTimeString()}
                                </span>
                            </div>
                            {link && (
                                <a
                                    href={link}
                                    className="text-saber hover:text-white transition-colors"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FaExternalLinkAlt />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export { ProposalHistory }