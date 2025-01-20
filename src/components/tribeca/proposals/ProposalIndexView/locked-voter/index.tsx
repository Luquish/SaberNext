'use client'

import { ProposalState, VoteSide } from '@tribecahq/tribeca-sdk'
import { noop } from 'lodash-es'
import { useParams } from 'next/navigation'

import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { Profile } from '@/components/tribeca/Profile'
import { PlaceholderSubtitle } from '@/components/tribeca/overview/locked-voter/ProposalsList/PlaceholderCard'
import { ProposalSubtitle } from '@/components/tribeca/overview/locked-voter/ProposalsList/ProposalSubtitle'
import { useProposal } from '@/hooks/tribeca/useProposals'
import { ProposalActivate } from './actions/ProposalActivate'
import { ProposalExecute } from './actions/ProposalExecute'
import { ProposalQueue } from './actions/ProposalQueue'
import { ProposalVote } from './actions/ProposalVote'
import { ProposalDetails } from './ProposalDetails'
import { ProposalHelmet } from './ProposalHelmet'
import { ProposalHistory } from './ProposalHistory'
import { VotesCard } from './VotesCard'

/**
 * Main view component for displaying a single proposal's details and actions
 */
function ProposalIndexView() {
    const params = useParams()
    const proposalIndexStr = params?.proposalIndex as string ?? ''
    const { info: proposalInfo } = useProposal(parseInt(proposalIndexStr))

    return (
        <GovernancePage
            title={
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                    <div className="min-h-[36px] flex items-center break-words hyphens-auto">
                        {proposalInfo ? (
                            proposalInfo?.proposalMetaData?.title ?? 'Proposal'
                        ) : (
                            <ContentLoader className="w-40 h-7" />
                        )}
                    </div>
                </h1>
            }
            header={
                <div className="flex items-center gap-2 mt-2">
                    <div className="min-h-[20px]">
                        {proposalInfo ? (
                            <ProposalSubtitle proposalInfo={proposalInfo} />
                        ) : (
                            <PlaceholderSubtitle />
                        )}
                    </div>
                </div>
            }
            right={
                proposalInfo ? (
                    <div className="bg-warmGray-850 p-3 rounded">
                        <Profile address={proposalInfo.proposalData.proposer} />
                    </div>
                ) : undefined
            }
        >
            {proposalInfo && <ProposalHelmet proposalInfo={proposalInfo} />}
            <div className="grid gap-4 mb-20">
                <div className="grid md:grid-cols-2 gap-4">
                    <VotesCard
                        side={VoteSide.For}
                        proposal={proposalInfo ? proposalInfo.proposalData : null}
                    />
                    <VotesCard
                        side={VoteSide.Against}
                        proposal={proposalInfo ? proposalInfo.proposalData : null}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 flex flex-col gap-4">
                        <ProposalDetails proposalInfo={proposalInfo} />
                    </div>
                    <div className="w-full md:w-[350px] flex flex-col gap-4">
                        {proposalInfo?.status.state === ProposalState.Draft && (
                            <ProposalActivate proposal={proposalInfo} onActivate={noop} />
                        )}
                        {proposalInfo?.status.state === ProposalState.Active && (
                            <ProposalVote proposalInfo={proposalInfo} onVote={noop} />
                        )}
                        {proposalInfo?.status.state === ProposalState.Succeeded && (
                            <ProposalQueue proposal={proposalInfo} onActivate={noop} />
                        )}
                        {proposalInfo?.status.state === ProposalState.Queued && (
                            <ProposalExecute proposal={proposalInfo} onActivate={noop} />
                        )}
                        <ProposalHistory proposalInfo={proposalInfo} />
                    </div>
                </div>
            </div>
        </GovernancePage>
    )
}

export { ProposalIndexView }