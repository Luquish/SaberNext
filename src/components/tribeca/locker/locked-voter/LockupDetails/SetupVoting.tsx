'use client'

import Link from 'next/link'

import { Button } from '@/components/tribeca/Button'
import { EmptyStateConnectWallet } from '@/components/tribeca/EmptyState'
import { Card } from '@/components/tribeca/Card'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { formatDurationSeconds } from '@/utils/tribeca/format'

interface SetupVotingProps {
    className?: string
}

function SetupVoting({ className }: SetupVotingProps) {
    const { govToken, veToken, daoName, lockerData, governor } = useGovernor()
    const { sdkMut } = useSDK()

    const maxStakeFmt = lockerData
        ? formatDurationSeconds(
            lockerData.account.params.maxStakeDuration.toNumber()
        )
        : '--'

    return (
        <Card title="Setup Voting" className={className}>
            {!sdkMut ? (
                <EmptyStateConnectWallet />
            ) : (
                <div className="px-7 py-4 text-sm grid gap-4">
                    <p>
                        Participating in {daoName} Governance requires that an account have
                        a balance of vote-escrowed {govToken?.symbol} ({veToken?.symbol}).
                        participate in governance, you must lock up {govToken?.name} for a
                        period of time.
                    </p>
                    <p>
                        {veToken?.symbol} cannot be transferred. The only way to obtain{' '}
                        {veToken?.symbol} is by locking {govToken?.symbol}. The maximum lock
                        time is {maxStakeFmt}. One {govToken?.symbol} locked for{' '}
                        {maxStakeFmt} provides an initial balance of{' '}
                        {lockerData?.account.params.maxStakeVoteMultiplier.toString()}{' '}
                        {veToken?.symbol}.
                    </p>
                    <ExternalLink href="https://docs.tribeca.so/electorate/voting-escrow#voting-escrow-tokens">
                        Learn more
                    </ExternalLink>
                    <div>
                        <Link href={`/gov/${governor.toString()}/locker/lock`}>
                            <Button size="md" variant="primary"  >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </Card>
    )
}

export { SetupVoting }