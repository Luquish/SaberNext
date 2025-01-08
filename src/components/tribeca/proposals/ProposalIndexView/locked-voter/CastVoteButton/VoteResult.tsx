'use client'

import { VoteSide } from '@tribecahq/tribeca-sdk';

import { useGovernor } from '@/hooks/tribeca/useGovernor';
import type { ProposalInfo } from '@/hooks/tribeca/useProposals';
import { Button } from '@/components/tribeca/Button';
import { ModalInner } from '@/components/tribeca/Modal/ModalInner';
import { VOTE_SIDE_LABEL } from '../VotesCard';

interface Props {
    proposalInfo: ProposalInfo,
    side: VoteSide,
    reason: string | null,
}

interface TweetParams {
    daoName: string,
    proposal: ProposalInfo,
    side: VoteSide,
    reason: string | null,
}

/**
 * Formats the tweet text for sharing a vote
 */
function formatTweet({ daoName, proposal, side, reason }: TweetParams): string {
    return [
        `I ${
            side !== VoteSide.Abstain
                ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
                : 'abstained from voting on'
        } ${daoName} Proposal #${proposal.index}${
            proposal.proposalMetaData?.title
                ? `: ${proposal.proposalMetaData.title}`
                : ''
        }`,
        reason,
        `Vote here: ${window.location.href}`,
    ]
        .filter((s) => !!s)
        .join('\n\n')
}

/**
 * Component that displays the vote confirmation and sharing options
 */
function VoteResult({ proposalInfo, side, reason }: Props) {
    const { daoName } = useGovernor()
    
    return (
        <ModalInner title="Vote Confirmed" className="px-6 max-w-md">
            <div className="flex flex-col items-center">
                <div className="text-center max-w-sm flex flex-col items-center gap-3">
                    <h2 className="text-white font-semibold text-xl leading-loose">
                        You{' '}
                        {side !== VoteSide.Abstain
                            ? `voted ${VOTE_SIDE_LABEL[side].toLowerCase()}`
                            : 'abstained from voting on'}
                        <br />
                        {proposalInfo.proposalMetaData?.title ??
                            `Proposal #${proposalInfo.index}`}
                    </h2>
                    <p className="text-sm leading-loose text-warmGray-400">
                        Help spread the word for your
                        <br />
                        choice to win the vote:
                    </p>
                </div>
                <div className="mt-8">
                    {daoName && (
                        <a
                            target="_blank"
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                formatTweet({
                                    daoName,
                                    proposal: proposalInfo,
                                    side,
                                    reason,
                                }),
                            )}`}
                            rel="noreferrer"
                        >
                            <Button variant="primary" size="md">
                                Tweet your {side === VoteSide.For ? 'support' : 'stance'}
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </ModalInner>
    )
}

export { VoteResult }