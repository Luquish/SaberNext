'use client'

import { VoteSide } from '@tribecahq/tribeca-sdk'

import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { CastVoteModal } from './CastVoteModal'

interface Props {
    proposalInfo: ProposalInfo,
    side: VoteSide | null,
}

/**
 * Button component that opens the modal for casting or changing a vote
 */
function CastVoteButton({ proposalInfo, side }: Props) {
    const getButtonLabel = () => {
        if (side === null || side === VoteSide.Pending) {
            return 'Cast Vote'
        }
        return 'Change Vote'
    }

    return (
        <ModalButton
            className="max-w-md"
            buttonProps={{
                variant: 'outline',
                className: 'border-white w-2/5 hover:border-primary hover:bg-primary hover:bg-opacity-20',
            }}
            buttonLabel={getButtonLabel()}
        >
            <CastVoteModal proposalInfo={proposalInfo} />
        </ModalButton>
    )
}

export { CastVoteButton }