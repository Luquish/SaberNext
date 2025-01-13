'use client'

import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
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
    
    return (
        <div className={`flex items-center gap-2 mt-2 ${className || ''}`}>
            <ProposalStateLabel state={state} executed={executed} />
            <div className='flex gap-1 text-xs font-semibold'>
                <span>{`000${proposalInfo.index}`.slice(-4)}</span>
                <span>&middot;</span>
                <ProposalStateDate proposalInfo={proposalInfo} />
            </div>
        </div>
    )
}