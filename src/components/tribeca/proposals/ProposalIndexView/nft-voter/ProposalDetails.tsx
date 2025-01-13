'use client'

import { Card } from '@/components/tribeca/Card'
import { IXSummary } from '@/components/tribeca/IXSummary'
import { TransactionPreviewLink } from '@/components/tribeca/TransactionPreviewLink'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'

interface Props {
    className?: string
    proposalInfo?: ProposalInfo | null
}

/**
 * Component that displays detailed proposal information including instructions and description
 */
function ProposalDetails({ className, proposalInfo }: Props) {
    const descriptionRaw = proposalInfo?.proposalMetaData?.descriptionLink ?? ''
    const description = descriptionRaw.substring(
        0,
        descriptionRaw.lastIndexOf('[')
    )
    const discussionLink = descriptionRaw.substring(
        descriptionRaw.lastIndexOf('(') + 1,
        descriptionRaw.lastIndexOf(')')
    )

    return (
        <Card className={className} title="Details">
            <div>
                {proposalInfo?.proposalData.instructions.map((ix, i) => (
                    <div key={i} className="px-7 py-5 border-b border-warmGray-800 flex">
                        <div className="w-10 text-warmGray-600 font-medium">{i + 1}</div>
                        <div className="text-white flex-1">
                            <IXSummary instruction={ix} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-7">
                {proposalInfo &&
                    !proposalInfo.status.executed &&
                    proposalInfo.proposalData.instructions.length > 0 && (
                    <TransactionPreviewLink
                        instructions={proposalInfo.proposalData.instructions}
                    />
                )}
                <div className={!proposalInfo?.status.executed ? 'mt-7' : ''}>
                    <article className="flex flex-col">
                        <span>{description}</span>
                        {discussionLink && (
                            <ExternalLink 
                                className="my-4 text-base" 
                                href={discussionLink}
                            >
                                View Discussion
                            </ExternalLink>
                        )}
                    </article>
                </div>
            </div>
        </Card>
    )
}

export { ProposalDetails }