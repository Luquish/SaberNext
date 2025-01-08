'use client'

import { Helmet } from 'react-helmet'

import { useCardinalName } from '@/hooks/tribeca/cardinal/useAddressName'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { tsToDate } from '@/utils/tribeca/utils'

interface Props {
    proposalInfo: ProposalInfo,
}

/**
 * Component that sets metadata tags for proposal pages
 */
function ProposalHelmet({ proposalInfo }: Props) {
    const { daoName } = useGovernor()
    const { index } = proposalInfo

    const cardinalName = useCardinalName(proposalInfo.proposalData.proposer)
    const author = cardinalName ?? proposalInfo.proposalData.proposer.toString()
    const twitterName = typeof cardinalName === 'string' && cardinalName.startsWith('@') 
        ? cardinalName 
        : null

    const title = proposalInfo?.proposalMetaData
        ? `${daoName ?? 'Governance'} Proposal #${index}: ${
            proposalInfo.proposalMetaData.title
        }`
        : `${daoName ?? 'Governance'} Proposal #${index}`

    const description = proposalInfo.proposalMetaData
        ? proposalInfo.proposalMetaData.descriptionLink.slice(0, 200)
        : null

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Helmet>
            <title>
                {title} | {daoName}
            </title>

            {description && <meta name="description" content={description} />}
            {description && <meta name="og:description" content={description} />}
            {description && <meta name="twitter:description" content={description} />}

            <meta name="og:title" content={title} />
            <meta name="og:type" content="article" />
            <meta
                name="og:article:published_time"
                content={tsToDate(proposalInfo.proposalData.createdAt).toISOString()}
            />
            {author && <meta name="og:article:author" content={author.toString()} />}

            <meta name="twitter:title" content={title} />
            {twitterName && <meta name="twitter:creator" content={twitterName} />}
        </Helmet>
    )
}

export { ProposalHelmet }