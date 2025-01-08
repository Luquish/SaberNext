'use client'

import { useSail } from '@rockooor/sail'
import BN from 'bn.js'
import invariant from 'tiny-invariant'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { Card } from '@/components/tribeca/Card'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface Props {
    proposal: ProposalInfo
    onActivate: () => void
}

/**
 * Component for queueing a passed proposal
 */
function ProposalQueue({ proposal, onActivate }: Props) {
    const { governorW } = useGovernor()
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    const votingEndedAt = new Date(
        proposal.proposalData.votingEndsAt.toNumber() * 1_000
    )

    const handleQueueProposal = async () => {
        invariant(governorW)
        
        const tx = await governorW.queueProposal({
            index: new BN(proposal.index),
        })
        
        const { pending, success } = await handleTX(
            await wrapTx(tx),
            'Queue Proposal'
        )
        
        if (!pending || !success) return
        
        await pending.wait()
        onActivate()
    }

    return (
        <Card title="Proposal Passed">
            <div className="px-7 py-4 text-sm">
                <p className="mb-4">
                    The proposal passed successfully on {votingEndedAt.toLocaleString()}.
                </p>
                <div className="flex justify-center items-center">
                    <AsyncButton
                        disabled={!governorW}
                        className="w-3/4"
                        variant="primary"
                        onClick={handleQueueProposal}
                    >
                        Queue Proposal
                    </AsyncButton>
                </div>
            </div>
        </Card>
    )
}

export { ProposalQueue }