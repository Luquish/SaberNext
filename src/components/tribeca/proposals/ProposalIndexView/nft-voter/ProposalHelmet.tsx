'use client'

import { Metadata } from 'next'

import { useCardinalName } from '@/hooks/tribeca/cardinal/useAddressName'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import type { ProposalInfo } from '@/hooks/tribeca/useProposals'
import { tsToDate } from '@/utils/tribeca/utils'

interface Props {
    proposalInfo: ProposalInfo
}

/**
 * Component that sets metadata for proposal pages
 */
function ProposalHelmet({ proposalInfo }: Props) {
    const { daoName } = useGovernor()
    const cardinalName = useCardinalName(proposalInfo.proposalData.proposer)
    const { index } = proposalInfo

    const author = cardinalName ?? proposalInfo.proposalData.proposer.toString()
    const twitterName = typeof cardinalName === 'string' && cardinalName.startsWith('@') ? cardinalName : null

    const title = proposalInfo?.proposalMetaData
        ? `${daoName ?? 'Governance'} Proposal #${index}: ${proposalInfo.proposalMetaData.title}`
        : `${daoName ?? 'Governance'} Proposal #${index}`

    const description = proposalInfo.proposalMetaData
        ? proposalInfo.proposalMetaData.descriptionLink.slice(0, 200)
        : null

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const metadata: Metadata = {
        title: `${title} | ${daoName}`,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: tsToDate(proposalInfo.proposalData.createdAt).toISOString(),
            authors: author ? [author.toString()] : undefined,
        },
        twitter: {
            title,
            description,
            creator: twitterName ?? undefined,
        },
    }

    // Next.js will handle metadata at build time
    // This component exists mainly for compatibility and future extensions
    return null
}

export { ProposalHelmet }