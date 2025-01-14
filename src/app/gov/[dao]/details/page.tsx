'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { GovernanceDetailsView as LockedVoter } from '@/components/tribeca/details/locked-voter'
import { GovernanceDetailsView as NftVoter } from '@/components/tribeca/details/nft-voter'

/**
 * Page component that renders either NFT or Locked voter governance details
 * based on the governor manifest configuration
 */
function GovernanceDetailsPage() {
    const { manifest } = useGovernor()

    // The NftVoter is developed and currently only used by Marinade
    if (manifest?.mndeNftLocker) {
        return <NftVoter />
    }

    return <LockedVoter />
}

export default GovernanceDetailsPage