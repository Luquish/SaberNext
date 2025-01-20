'use client'

import { ProposalState } from '@tribecahq/tribeca-sdk'
import { startCase } from 'lodash-es'
import {
    FaCheck,
    FaDraftingCompass,
    FaHourglass,
    FaTimes,
} from 'react-icons/fa'
import type { ProposalStatus } from '@/hooks/tribeca/useProposals'

interface Props {
    status: ProposalStatus
}

const STATE_LABELS: { [K in ProposalState]: string } = {
    [ProposalState.Active]: 'active',
    [ProposalState.Draft]: 'draft',
    [ProposalState.Canceled]: 'canceled',
    [ProposalState.Defeated]: 'failed',
    [ProposalState.Succeeded]: 'passed',
    [ProposalState.Queued]: 'queued',
}

function getStateIcon(state: ProposalState): React.ReactNode {
    const iconBaseClasses = 'h-3 w-3';
    const containerBaseClasses = 'h-6 w-6 rounded-full flex items-center justify-center text-white';

    switch (state) {
    case ProposalState.Active:
        return (
            <div className={`${containerBaseClasses} bg-accent`}>
                <FaHourglass className={iconBaseClasses} />
            </div>
        )
            
    case ProposalState.Canceled:
    case ProposalState.Defeated:
        return (
            <div className={`${containerBaseClasses} bg-gray-500`}>
                <FaTimes className={iconBaseClasses} />
            </div>
        )
            
    case ProposalState.Draft:
        return (
            <div className={`${containerBaseClasses} bg-gray-500`}>
                <FaDraftingCompass className={iconBaseClasses} />
            </div>
        )
            
    default:
        return (
            <div className={`${containerBaseClasses} bg-saber`}>
                <FaCheck className={iconBaseClasses} />
            </div>
        )
    }
}

export function ProposalStateBadge({ status }: Props) {
    const { executed, state } = status
    
    return (
        <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-5">
            {getStateIcon(state)}
            <span className="text-xs md:text-sm text-white">
                {startCase(executed ? 'executed' : STATE_LABELS[state])}
            </span>
        </div>
    )
}