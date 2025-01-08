'use client'

import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { MarinadeMigration } from '@/components/tribeca/MarinadeMigration'
import { useGovWindowTitle } from '@/hooks/tribeca/useGovernor'

/**
 * Main view component for the locker page with Marinade migration notice
 */
function LockerIndexView() {
    useGovWindowTitle('Locker')
    
    return (
        <GovernancePage
            title="Vote Locker"
            preContent={<MarinadeMigration />}
            hideDAOName={true}
        />
    )
}

export { LockerIndexView }