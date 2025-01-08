'use client'

import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { SetupVoting } from './SetupVoting'
import { YourLockup } from './YourLockup'

interface LockupDetailsProps {
    className?: string
}

function LockupDetails({ className }: LockupDetailsProps) {
    const { sdkMut } = useSDK()
    const { data: userLockup, isLoading, isFetched, escrow } = useUserEscrow()

    if (isLoading || (sdkMut && escrow === undefined && !isFetched)) {
        return (
            <Card className={className} title="Your Lockup">
                <div className="py-6">
                    <LoadingPage />
                </div>
            </Card>
        )
    }

    if (!userLockup) {
        return <SetupVoting className={className} />
    }

    return <YourLockup className={className} />
}

export { LockupDetails }