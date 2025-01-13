'use client'

import { Card } from '@/components/tribeca/Card'
import { IXSummary } from '@/components/tribeca/IXSummary'
import { TransactionPreviewLink } from '@/components/tribeca/TransactionPreviewLink'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { extractGitHubIssueURL, useGitHubIssue } from './github'
import { ProposalBody } from './ProposalBody'
import { GitHubComments } from './ProposalBody/GitHubComments'

interface Props {
    className?: string,
    proposalInfo?: ProposalInfo | null,
}

/**
 * Component that displays detailed proposal information including instructions and GitHub content
 */
function ProposalDetails({
    className,
    proposalInfo,
}: Props) {
    const description = proposalInfo?.proposalMetaData?.descriptionLink ?? ''

    const issueURL = extractGitHubIssueURL(description)
    const { data: githubIssue } = useGitHubIssue(issueURL)

    return (
        <>
            <Card className={className} title="Details">
                <div>
                    {proposalInfo?.proposalData.instructions.map((ix, i) => (
                        <div 
                            key={i} 
                            className="px-7 py-5 border-b border-warmGray-800 flex"
                        >
                            <div className="w-10 text-warmGray-600 font-medium">
                                {i + 1}
                            </div>
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
                        <ProposalBody description={description} issue={githubIssue} />
                    </div>
                </div>
            </Card>
            {githubIssue && <GitHubComments issue={githubIssue} />}
        </>
    )
}

export { ProposalDetails }