'use client'

import { ProposalState } from '@tribecahq/tribeca-sdk'
import { startCase } from 'lodash-es'

interface Props {
    state: ProposalState
    executed?: boolean
}

const STATE_LABELS: { [K in ProposalState]: string } = {
    [ProposalState.Active]: 'active',
    [ProposalState.Draft]: 'draft',
    [ProposalState.Canceled]: 'canceled',
    [ProposalState.Defeated]: 'failed',
    [ProposalState.Succeeded]: 'passed',
    [ProposalState.Queued]: 'queued',
}

export function ProposalStateLabel({ state, executed }: Props) {
    const baseClasses = 'text-xs border rounded py-0.5 w-16 flex items-center justify-center'
    
    const stateClasses = {
        canceled: 'border-gray-500 text-gray-500',
        succeeded: 'border-primary text-saber',
        active: 'border-accent text-accent',
    }
    
    const getStateClass = () => {
        if (state === ProposalState.Canceled || 
            state === ProposalState.Defeated || 
            state === ProposalState.Draft) {
            return stateClasses.canceled
        }
        
        if (executed || 
            state === ProposalState.Succeeded || 
            state === ProposalState.Queued) {
            return stateClasses.succeeded
        }
        
        if (state === ProposalState.Active) {
            return stateClasses.active
        }
        
        return ''
    }

    return (
        <div className={`${baseClasses} ${getStateClass()}`}>
            {startCase(executed ? 'executed' : STATE_LABELS[state])}
        </div>
    )
}