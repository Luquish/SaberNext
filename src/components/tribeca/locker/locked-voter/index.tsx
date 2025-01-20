'use client'

import Link from 'next/link'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { EscrowInfo } from './EscrowInfo'
import { LockerSnapshotsBasic } from './LockerSnapshotsBasic'
import { LockupDetails } from './LockupDetails'

/**
 * Main view for the locker page that displays escrow info, proposal creation,
 * lockup details and snapshots
 */
function LockedVoterView() {
    const { path } = useGovernor()
    useGovWindowTitle('Locker')

    return (
        <GovernancePage title="Vote Locker">
            <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
                <div className="w-full md:w-[300px] flex flex-col gap-4 flex-shrink-0">
                    <EscrowInfo />
                    <Card>
                        <div className="px-7 py-5">
                            <Link href={`${path}/proposals/create`}>
                                <Button 
                                    size="md" 
                                    className="w-full" 
                                    variant="primary"
                                >
                                    Create Proposal
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
                <div className="flex-grow flex flex-col gap-4">
                    <LockupDetails />
                    <LockerSnapshotsBasic />
                </div>
            </div>
        </GovernancePage>
    )
}

export { LockedVoterView as LockerIndexView }