'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { ProposalIndexView as LockedVoter } from './locked-voter'
import { ProposalIndexView as NftVoter } from './nft-voter'

/**
 * View component that renders either NFT or Locked voter proposal details
 * based on the governor manifest configuration
 */
function ProposalIndexView() {
    const { manifest } = useGovernor()

    // The NftVoter is developed and currently only used by Marinade
    if (manifest?.mndeNftLocker) {
        return <NftVoter />
    }

    return <LockedVoter />
}

export { ProposalIndexView }
export default ProposalIndexView