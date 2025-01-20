'use client'

import { Fraction } from '@saberhq/token-utils'
import type { ProposalData } from '@tribecahq/tribeca-sdk'
import { VoteSide } from '@tribecahq/tribeca-sdk'
import { BN } from 'bn.js'

import { Card } from '@/components/tribeca/Card'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { Meter } from '@/components/tribeca/Meter'
import { useGovernor } from '@/hooks/tribeca/useGovernor'

export const VOTE_SIDE_LABEL = {
    [VoteSide.For]: 'For',
    [VoteSide.Against]: 'Against',
    [VoteSide.Abstain]: 'Abstain',
    [VoteSide.Pending]: 'Pending',
} as const

interface Props {
    side: VoteSide.For | VoteSide.Against | VoteSide.Abstain
    proposal: ProposalData | null
}

/**
 * Card component that displays vote counts and progress meter for a proposal
 */
function VotesCard({ side, proposal }: Props) {
    const { veToken } = useGovernor()
    
    const voteCount = !proposal
        ? null
        : side === VoteSide.For
            ? proposal.forVotes
            : side === VoteSide.Against
                ? proposal.againstVotes
                : side === VoteSide.Abstain
                    ? proposal.abstainVotes
                    : new BN(0)

    const voteCountFmt =
        veToken && voteCount !== null ? (
            new Fraction(voteCount, 10 ** veToken.decimals).asNumber.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 0,
                }
            )
        ) : (
            <LoadingSpinner />
        )

    const totalDeterminingVotes = !proposal
        ? null
        : proposal.forVotes.add(proposal.againstVotes).add(proposal.abstainVotes)

    const getBarColor = () => {
        switch (side) {
        case VoteSide.For:
            return 'bg-saber'
        case VoteSide.Against:
            return 'bg-red-500'
        default:
            return 'bg-yellow-500'
        }
    }

    return (
        <Card
            title={
                <div className="flex flex-col gap-3.5 w-full">
                    <div className="flex items-center justify-between">
                        <div>{VOTE_SIDE_LABEL[side]}</div>
                        <div>{voteCountFmt}</div>
                    </div>
                    <Meter
                        value={voteCount ?? new BN(0)}
                        max={BN.max(totalDeterminingVotes ?? new BN(0), new BN(1))}
                        barColor={getBarColor()}
                    />
                </div>
            }
        />
    )
}

export { VotesCard }