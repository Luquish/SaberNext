'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { ProposalsListView as LockedVoter } from '@/components/tribeca/proposals/locked-voter'
import { ProposalsListView as NftVoter } from '@/components/tribeca/proposals/nft-voter'

/**
 * View component that renders either NFT or Locked voter proposals list
 * based on the governor manifest configuration
 */
export default function ProposalsListView() {
    const { manifest } = useGovernor()

    // The NftVoter is developed and currently only used by Marinade
    if (manifest?.mndeNftLocker) {
        return <NftVoter />
    }

    return <LockedVoter />
}
