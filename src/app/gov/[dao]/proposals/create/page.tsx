'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { ProposalCreateView as LockedVoter } from '@/components/tribeca/proposals/ProposalCreateView/locked-voter'
import { ProposalCreateView as NftVoter } from '@/components/tribeca/proposals/ProposalCreateView/nft-voter'

/**
 * View component that renders either NFT or Locked voter proposal creation form
 * based on the governor manifest configuration
 */
function ProposalCreateView() {
    const { manifest } = useGovernor()

    // The NftVoter is developed and currently only used by Marinade
    if (manifest?.mndeNftLocker) {
        return <NftVoter />
    }

    return <LockedVoter />
}

export { ProposalCreateView }
export default ProposalCreateView