'use client'

import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods'
import { fetchNullable } from '@rockooor/sail'
import { useQuery } from '@tanstack/react-query'

export type GitHubIssue =
    RestEndpointMethodTypes['issues']['get']['response']['data']

export type GitHubComments =
    RestEndpointMethodTypes['issues']['listComments']['response']['data']

/**
 * Extracts GitHub issue API URL from a proposal body text
 * @param body - The proposal body text containing the GitHub issue link
 * @returns The GitHub API URL for the issue or null if not found
 */
function extractGitHubIssueURL(body: string): string | null {
    const match = body.match(
        /\[View Discussion\]\(https:\/\/github.com\/(\w+)\/(\w+)\/issues\/(\d+)\)/,
    )
    if (!match) {
        return null
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, org, repo, issue] = match
    if (!org || !repo || !issue) {
        return null
    }
    return `https://api.github.com/repos/${org}/${repo}/issues/${issue}`
}

/**
 * Hook to fetch GitHub issue data
 * @param issueURL - The GitHub API URL for the issue
 */
function useGitHubIssue(issueURL: string | null) {
    return useQuery({
        queryKey: ['githubIssue', issueURL],
        queryFn: async () => {
            if (!issueURL) {
                return null
            }
            return await fetchNullable<GitHubIssue>(issueURL)
        },
    })
}

/**
 * Hook to fetch GitHub issue comments
 * @param commentsURL - The GitHub API URL for the issue comments
 */
function useGitHubIssueComments(commentsURL: string | null) {
    return useQuery({
        queryKey: ['githubIssueComments', commentsURL],
        queryFn: async () => {
            if (!commentsURL) {
                return null
            }
            return await fetchNullable<GitHubComments>(commentsURL)
        },
    })
}

export { extractGitHubIssueURL, useGitHubIssue, useGitHubIssueComments }