'use client'

import { BN } from 'bn.js'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { makeDate } from '@/components/tribeca/proposals/ProposalIndexView/nft-voter/ProposalHistory'
import { ProposalStateDate } from './ProposalStateDate'
import { ProposalStateLabel } from './ProposalStateLabel'

interface Props {
    className?: string
    proposalInfo: ProposalInfo
}

export function ProposalSubtitle({
    proposalInfo,
    className,
}: Props) {
    const { state, executed } = proposalInfo.status

    const queuedDate = !proposalInfo.proposalData.queuedAt.eq(new BN(0))
        ? makeDate(proposalInfo.proposalData.queuedAt)
        : undefined

    const expiredDate = queuedDate
    if (expiredDate) {
        expiredDate.setDate(expiredDate.getDate() + 14)
    }

    return (
        <div className={`flex items-center gap-2 mt-2 ${className || ''}`}>
            <ProposalStateLabel
                state={state}
                executed={executed || (expiredDate && expiredDate <= new Date())}
            />
            <div className='flex gap-1 text-xs font-semibold'>
                <span>{`000${proposalInfo.index}`.slice(-4)}</span>
                <span>&middot;</span>
                <ProposalStateDate proposalInfo={proposalInfo} />
            </div>
        </div>
    )
}