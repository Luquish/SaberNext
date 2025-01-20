'use client'

import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { MarinadeMigration } from '@/components/tribeca/MarinadeMigration'
import { useGovWindowTitle } from '@/hooks/tribeca/useGovernor'

/**
 * View component that displays NFT voter governance details with Marinade migration notice
 */
function GovernanceDetailsView() {
    useGovWindowTitle('Details')
    
    return (
        <GovernancePage
            title="Governance Details"
            preContent={<MarinadeMigration />}
            hideDAOName
        />
    )
}

export { GovernanceDetailsView }