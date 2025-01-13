'use client'

import { TokenAmount } from '@saberhq/token-utils'
import type { VoteSide } from '@tribecahq/tribeca-sdk'
import { VOTE_SIDE_LABELS } from '@tribecahq/tribeca-sdk'
import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { MouseoverTooltip } from '@/components/tribeca/MouseoverTooltip'
import { WalletButton } from '@/components/tribeca/layout/GovernorLayout/Header/WalletButton'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { useVote } from '@/hooks/tribeca/useVote'
import { getVoteColor } from '@/utils/tribeca/voting'
import { CastVoteButton } from '../CastVoteButton'

interface Props {
    proposalInfo: ProposalInfo,
    onVote: () => void,
}

/**
 * Component that displays voting interface for a proposal
 */
function ProposalVote({ proposalInfo }: Props) {
    const { veToken, path } = useGovernor()
    const { sdkMut } = useSDK()
    const { data: escrow, veBalance } = useUserEscrow()
    const { data: vote } = useVote(
        proposalInfo.proposalKey,
        sdkMut?.provider.wallet.publicKey,
    )

    const vePower = veToken && escrow
        ? new TokenAmount(
            veToken,
            escrow.calculateVotingPower(
                proposalInfo.proposalData.votingEndsAt.toNumber(),
            ),
        )
        : null

    const lockupTooShort = escrow && 
        escrow.escrow.escrowEndsAt.lt(proposalInfo.proposalData.votingEndsAt)

    return (
        <Card
            title={
                <div className="flex">
                    <span>Vote</span>
                    {lockupTooShort && (
                        <MouseoverTooltip
                            text={
                                <div className="max-w-sm">
                                    <p>
                                        Your voting escrow expires before the period which voting
                                        ends. Please extend your lockup to cast your vote.
                                    </p>
                                </div>
                            }
                            placement="bottom-start"
                        >
                            <FaExclamationTriangle className="h-4 cursor-pointer inline-block align-middle mx-2 mb-0.5 text-yellow-500" />
                        </MouseoverTooltip>
                    )}
                </div>
            }
        >
            <div className="py-8">
                <div className="flex flex-col items-center gap-4">
                    {!sdkMut ? (
                        <WalletButton />
                    ) : !veBalance ? (
                        <div className="text-sm px-8 text-center">
                            <p>You must lock tokens in order to vote on this proposal.</p>
                            <Link 
                                className="flex justify-center items-center" 
                                href={`${path}/locker`}
                            >
                                <Button
                                    variant="outline"
                                    className="border-white hover:border-primary hover:bg-primary hover:bg-opacity-20 mt-4"
                                >
                                    Lock Tokens
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-medium">Voting Power</span>
                                <span className="text-white font-semibold text-lg">
                                    {vePower?.formatUnits()}
                                </span>
                            </div>
                            {vote && (
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-sm font-medium">You Voted</span>
                                    <span
                                        className="text-white font-semibold text-lg"
                                        style={
                                            vote
                                                ? {
                                                    color: getVoteColor(vote.accountInfo.data.side),
                                                }
                                                : {}
                                        }
                                    >
                                        {VOTE_SIDE_LABELS[vote.accountInfo.data.side as VoteSide]}
                                    </span>
                                </div>
                            )}
                            <div className="flex w-full items-center justify-center">
                                <CastVoteButton
                                    proposalInfo={proposalInfo}
                                    side={vote ? vote.accountInfo.data.side : null}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}

export { ProposalVote }