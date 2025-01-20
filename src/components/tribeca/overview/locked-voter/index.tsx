'use client'

import {
    useGovernor,
    useGovWindowTitle,
} from '@/hooks/tribeca/useGovernor'
import { Card } from '@/components/tribeca/Card'
// import { ImageWithFallback } from '@/components/tribeca/ImageWithFallback'
import { ProgramsList } from '@/components/tribeca/programs/ProgramsList'
import { OverviewHeader } from './OverviewHeader'
import { RecentProposals } from './RecentProposals'

export function GovernanceOverviewView() {
    useGovWindowTitle('Overview')
    const { path } = useGovernor()
    // const { daoName, iconURL } = useGovernor()
    
    return (
        <div className="w-full flex flex-col gap-6">
            {/* <div className='flex items-center gap-2 mb-6'>
                <ImageWithFallback
                    src={iconURL}
                    size={36}
                    alt={`Icon for ${daoName ?? 'DAO'}`}
                />
            </div> */}
            <OverviewHeader />
            <RecentProposals />
            <Card
                className='mt-8'
                title='Programs'
                link={{
                    title: 'View all programs',
                    href: `${path}/programs`,
                }}
            >
                <ProgramsList maxCount={3} />
            </Card>
        </div>
    )
}