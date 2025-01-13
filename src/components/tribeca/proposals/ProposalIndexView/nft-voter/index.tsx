'use client'

import { VoteSide } from '@tribecahq/tribeca-sdk'
import { useParams } from 'next/navigation'

import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { Profile } from '@/components/tribeca/Profile'
import { useProposal } from '@/hooks/tribeca/useProposals'
import { PlaceholderSubtitle } from '@/components/tribeca/overview/nft-voter/ProposalsList/PlaceholderCard'
import { ProposalSubtitle } from '@/components/tribeca/overview/nft-voter/ProposalsList/ProposalSubtitle'
import { ProposalDetails } from './ProposalDetails'
import { ProposalHelmet } from './ProposalHelmet'
import { VotesCard } from './VotesCard'



/**
 * View component for displaying detailed proposal information
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
                <div className="grid md:grid-cols-3 gap-4">
                    <VotesCard
                        side={VoteSide.For}
                        proposal={proposalInfo ? proposalInfo.proposalData : null}
                    />
                    <VotesCard
                        side={VoteSide.Against}
                        proposal={proposalInfo ? proposalInfo.proposalData : null}
                    />
                    <VotesCard
                        side={VoteSide.Abstain}
                        proposal={proposalInfo ? proposalInfo.proposalData : null}
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <ProposalDetails className="flex-1" proposalInfo={proposalInfo} />
                </div>
            </div>
        </GovernancePage>
    )
}

export { ProposalIndexView }