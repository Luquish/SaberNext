'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { TabNav } from '@/components/tribeca/manage/TabNav'

/**
 * Main view component for DAO governance management
 */
function GovernanceManageView() {
    const { path, daoName } = useGovernor()
    const { isMemberOfEC } = useExecutiveCouncil()

    return (
        <GovernancePage title="Manage" containerStyles={{ maxWidth: '7xl' }}>
            {isMemberOfEC ? (
                <div className="flex flex-col md:flex-row gap-8">
                    <TabNav />
                    <div className="flex-1">
                        {/* Children will be rendered here in Next.js */}
                    </div>
                </div>
            ) : (
                <Card title="Unauthorized" padded>
                    <div className="flex flex-col items-center gap-4 my-4">
                        <Image
                            src="/images/tribeca/unauthorized.jpeg"
                            alt="Stop right here."
                            width={400}
                            height={300}
                        />
                        <p>
                            You must be on the {daoName} Executive Council to view this page.
                        </p>
                        <Link href={path}>
                            <Button>Return to Home</Button>
                        </Link>
                    </div>
                </Card>
            )}
        </GovernancePage>
    )
}

export default GovernanceManageView