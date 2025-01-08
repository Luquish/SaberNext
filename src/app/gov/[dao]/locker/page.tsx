'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { LockerIndexView as LockedVoter } from '@/components/tribeca/locker/locked-voter'
import { LockerIndexView as NftVoter } from '@/components/tribeca/locker/nft-voter'

/**
 * Router component that determines which locker view to display based on the governor manifest
 * - NftVoter: Used by Marinade for NFT-based voting
 * - LockedVoter: Default token-based voting implementation
 */
function LockerIndexView() {
    const { manifest } = useGovernor()

    if (manifest?.mndeNftLocker) {
        return <NftVoter />
    }
    
    return <LockedVoter />
}

export default LockerIndexView