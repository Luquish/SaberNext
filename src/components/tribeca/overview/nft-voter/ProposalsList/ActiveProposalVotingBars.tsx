'use client'

import { BN } from 'bn.js';

import { useGovernor } from '@/hooks/tribeca/useGovernor';
import type { ProposalInfo } from '@/hooks/tribeca/useProposals';
import { formatNumberSI } from '@/utils/tribeca/format';
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner';
import { Meter } from '@/components/tribeca/Meter';

interface Props {
    proposal: ProposalInfo
}

export function ActiveProposalVotingBars({ proposal }: Props) {
    const { veToken } = useGovernor()
    
    if (!veToken) {
        return <LoadingSpinner />
    }
    
    const forVotes = proposal.proposalData.forVotes
        .div(new BN(10 ** veToken.decimals))
        .toNumber()
        
    const againstVotes = proposal.proposalData.againstVotes
        .div(new BN(10 ** veToken.decimals))
        .toNumber()
        
    const maxVotes = Math.max(forVotes, againstVotes, 1)
    
    return (
        <div className="flex flex-col">
            <div className="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
                <Meter
                    value={forVotes}
                    max={maxVotes}
                    barColor="primary"
                />
                <div className="basis-[44px]">
                    {formatNumberSI(forVotes)}
                </div>
            </div>
            <div className="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
                <Meter
                    value={againstVotes}
                    max={maxVotes}
                    barColor="red-500"
                />
                <div className="basis-[44px]">
                    {formatNumberSI(againstVotes)}
                </div>
            </div>
        </div>
    )
}