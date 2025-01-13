'use client'

import Link from 'next/link'
import { ProposalState } from '@tribecahq/tribeca-sdk'
import { BN } from 'bn.js'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { PROPOSAL_TITLE_MAX_LEN } from '@/utils/tribeca/constants'
import { makeDate } from '@/components/tribeca/proposals/ProposalIndexView/nft-voter/ProposalHistory'
import { ActiveProposalVotingBars } from './ActiveProposalVotingBars'
import { ProposalStateBadge } from './ProposalStateBadge'
import { ProposalStateDate } from './ProposalStateDate'
import { ProposalStateLabel } from './ProposalStateLabel'
import PulsingDot from './PulsingDot.svg';

interface Props {
    proposalInfo: ProposalInfo
}

export function ProposalCard({ proposalInfo }: Props) {
    const { path } = useGovernor()
    const { state, executed } = proposalInfo.status

    const queuedDate = !proposalInfo.proposalData.queuedAt.eq(new BN(0))
        ? makeDate(proposalInfo.proposalData.queuedAt)
        : undefined

    const expiredDate = queuedDate
    if (expiredDate) {
        expiredDate.setDate(expiredDate.getDate() + 14)
    }
    const expired = expiredDate && expiredDate <= new Date()

    return (
        <Link
            href={`${path}/proposals/${proposalInfo.index}`}
            className='flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary'
        >
            <div className='flex items-center gap-5 w-3/4 md:w-[500px]'>
                {state === ProposalState.Active && (
                    <PulsingDot className='w-11 h-11 text-accent' />
                )}
                <div>
                    <div className='flex items-center'>
                        <div className='text-white leading-snug break-words hyphens-auto'>
                            {proposalInfo.proposalMetaData?.title.slice(
                                0,
                                PROPOSAL_TITLE_MAX_LEN
                            )}
                        </div>
                    </div>
                    {proposalInfo.proposalData && state !== null && (
                        <div className='flex flex-col mt-4 gap-2 md:flex-row md:items-center md:mt-2'>
                            <ProposalStateLabel
                                state={state}
                                executed={executed || expired}
                            />
                            <div className='flex gap-1 text-xs font-semibold'>
                                <span>{`000${proposalInfo.index}`.slice(-4)}</span>
                                <span>&middot;</span>
                                <ProposalStateDate proposalInfo={proposalInfo} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {state === ProposalState.Active && (
                <div className='w-[290px]'>
                    <ActiveProposalVotingBars proposal={proposalInfo} />
                </div>
            )}
            {state !== null &&
                state !== ProposalState.Draft &&
                state !== ProposalState.Active && (
                <div className='w-16 md:w-20 lg:w-[140px]'>
                    <ProposalStateBadge
                        status={{
                            ...proposalInfo.status,
                            executed: executed || (expired ?? false),
                        }}
                    />
                </div>
            )}
        </Link>
    )
}