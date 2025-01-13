'use client'

import { formatDistance } from 'date-fns'
import Image from 'next/image'

import { Card } from '@/components/tribeca/Card'
import { ProseSmall } from '@/components/tribeca/typography/Prose'
import type { GitHubIssue } from '../github'
import { useGitHubIssueComments } from '../github'

interface Props {
    issue: GitHubIssue,
}

/**
 * Component that displays GitHub comments for a proposal issue
 */
function GitHubComments({ issue }: Props) {
    const { data: githubComments } = useGitHubIssueComments(issue.comments_url)
    
    return (
        <Card title={`Comments (${issue.comments})`} padded>
            <ProseSmall>
                <div className="flex flex-col gap-4">
                    {githubComments?.map((comment) => (
                        <div key={comment.id} className="flex gap-4 w-full">
                            <Image
                                src={comment.user?.avatar_url ?? ''}
                                className="w-8 h-8 rounded-full"
                                alt={`Profile of ${comment.user?.login ?? ''}`}
                                width={32}
                                height={32}
                            />
                            <div className="border rounded-lg border-warmGray-700 flex-1">
                                <div className="px-4 py-2 bg-warmGray-800 border-b border-b-warmGray-700 rounded-t-lg">
                                    <a
                                        href={comment.user?.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {comment.user?.login}
                                    </a>{' '}
                                    <span className="text-warmGray-400">
                                        commented{' '}
                                        {formatDistance(new Date(comment.created_at), new Date(), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                                <div className="px-5 py-3">{comment.body}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full text-center py-8">
                    Got something to say? Add a comment to the{' '}
                    <a href={issue.html_url} target="_blank" rel="noreferrer">
                        proposal on GitHub
                    </a>
                    .
                </div>
            </ProseSmall>
        </Card>
    )
}

export { GitHubComments }