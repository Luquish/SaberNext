'use client'

import type { PublicKey } from '@solana/web3.js'

import { Button } from '@/components/tribeca/Button'
import { useProvider } from '@/hooks/tribeca/useProvider'
import { useCommitVotes } from '@/hooks/tribeca/gauges/useCommitVotes'

interface CommitVotesButtonProps {
    owner?: PublicKey
}

/**
 * Button component for committing gauge votes
 */
function CommitVotesButton({ owner }: CommitVotesButtonProps) {
    const { providerMut } = useProvider()
    const walletOwner = owner ?? providerMut?.wallet?.publicKey
    const commitVotes = useCommitVotes(walletOwner)

    return (
        <Button 
            variant="muted" 
            onClick={commitVotes}
        >
            Commit
        </Button>
    )
}

export { CommitVotesButton }