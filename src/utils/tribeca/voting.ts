import { VoteSide } from '@tribecahq/tribeca-sdk'

/**
 * Returns the appropriate Tailwind CSS color class based on the vote side
 */
function getVoteColor(side: VoteSide): string {
    switch (side) {
    case VoteSide.For:
        return 'bg-primary'
    case VoteSide.Against:
        return 'bg-red-500'
    case VoteSide.Abstain:
        return 'bg-yellow-500'
    default:
        return 'bg-transparent'
    }
}

export { getVoteColor }