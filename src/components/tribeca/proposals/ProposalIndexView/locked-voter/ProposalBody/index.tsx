'use client'

import ReactMarkdown from 'react-markdown'

import { Prose } from '@/components/tribeca/typography/Prose'
import type { GitHubIssue } from '../github'

interface Props {
    description: string,
    issue?: GitHubIssue | null,
}

/**
 * Component that renders the proposal body content including GitHub issue if available
 */
function ProposalBody({
    description,
    issue,
}: Props) {
    return (
        <article>
            <Prose>
                {issue && (
                    <div className="border-b border-b-gray-700 pb-8 mb-8">
                        <ReactMarkdown>
                            {issue.body ?? ''}
                        </ReactMarkdown>
                    </div>
                )}
                <ReactMarkdown>
                    {description}
                </ReactMarkdown>
            </Prose>
        </article>
    )
}

export { ProposalBody }