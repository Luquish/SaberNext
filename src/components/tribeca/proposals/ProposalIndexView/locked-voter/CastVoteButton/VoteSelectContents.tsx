'use client'

import { VoteSide } from '@tribecahq/tribeca-sdk'
import { sum } from 'lodash-es'
import invariant from 'tiny-invariant'

import { HelperCard } from '@/components/tribeca/HelperCard'
import { Textarea } from '@/components/tribeca/inputs/InputText'
import { Meter } from '@/components/tribeca/Meter'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { FORMAT_VOTE_PERCENT } from '@/utils/tribeca/format'
import { getVoteColor } from '@/utils/tribeca/voting'
import { VOTE_SIDE_LABEL } from '../VotesCard'

interface Props {
    proposal: ProposalInfo,
    side: VoteSide | null,
    setSide: (side: VoteSide) => void,
    reason: string,
    setReason: (reason: string) => void,
}

/**
 * Component that displays voting options and allows users to select their vote
 */
function VoteSelectContents({
    proposal,
    side,
    setSide,
    reason,
    setReason,
}: Props) {
    const allVotes = (['forVotes', 'againstVotes', 'abstainVotes'] as const).map(
        (vote) => proposal.proposalData[vote].toNumber(),
    )
    const totalVotes = sum(allVotes)

    return (
        <div className="grid gap-4">
            <div className="flex flex-col items-center text-white font-semibold">
                <h2>Your Ballot for Proposal #{proposal.index}</h2>
            </div>
            <HelperCard variant="muted">
                <p>Select one of the options below to cast your vote.</p>
            </HelperCard>
            <div className="w-full flex flex-col gap-4 text-sm">
                {([VoteSide.For, VoteSide.Against, VoteSide.Abstain] as const).map(
                    (voteSide, i) => {
                        const myVotes = allVotes[i]
                        invariant(typeof myVotes === 'number')
                        const percent = FORMAT_VOTE_PERCENT.format(
                            totalVotes === 0 ? 0 : myVotes / totalVotes,
                        )
                        const voteColor = getVoteColor(voteSide)
                        
                        return (
                            <button
                                key={voteSide}
                                className={`flex items-center gap-4 px-5 py-4 border rounded transition-all ${
                                    side === voteSide ? voteColor : 'border-warmGray-600'
                                }`}
                                onClick={() => setSide(voteSide)}
                            >
                                <div>
                                    <div className="border border-gray-500 w-6 h-6">
                                        <svg
                                            className="w-full h-full"
                                            style={{
                                                strokeWidth: '15px',
                                                fill: 'none',
                                            }}
                                            viewBox="0 0 100 100"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            {voteSide === VoteSide.For ? (
                                                <path
                                                    d="M 10 50 L 40 86 L 90 10"
                                                    strokeDasharray="140"
                                                    strokeDashoffset={side === voteSide ? '0' : '140'}
                                                    className={voteColor}
                                                    style={{
                                                        transition: 'stroke-dashoffset 0.1s ease-in 0s',
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <path
                                                        d="M 10 10 L 90 90"
                                                        strokeDasharray="113"
                                                        strokeDashoffset={side === voteSide ? '0' : '113'}
                                                        className={voteColor}
                                                        style={{
                                                            transition: 'stroke-dashoffset 0.1s ease-in 0s',
                                                        }}
                                                    />
                                                    <path
                                                        d="M 90 10 L 10 90"
                                                        strokeDasharray="113"
                                                        strokeDashoffset={side === voteSide ? '0' : '113'}
                                                        className={voteColor}
                                                        style={{
                                                            transition: 'stroke-dashoffset 0.1s ease-in 0s',
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-grow">
                                    <div className="w-full flex items-center justify-between">
                                        <div className="text-white font-medium">
                                            {VOTE_SIDE_LABEL[voteSide]}
                                        </div>
                                        <div className="text-warmGray-400 font-medium">{percent}</div>
                                    </div>
                                    <Meter
                                        className="w-full"
                                        value={myVotes}
                                        max={totalVotes === 0 ? 1 : totalVotes}
                                        barColor={voteColor}
                                    />
                                </div>
                            </button>
                        )
                    },
                )}
            </div>
            <div className="mt-8">
                <label htmlFor="reason" className="flex flex-col gap-2">
                    <span className="font-medium text-white text-sm">
                        Add Reason (max 200 characters)
                    </span>
                    <Textarea
                        id="reason"
                        className="resize-none h-auto"
                        maxLength={200}
                        placeholder="Tell others why you are voting this way"
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </label>
            </div>
        </div>
    )
}

export { VoteSelectContents }