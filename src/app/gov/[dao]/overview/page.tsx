'use client'

import { notFound } from 'next/navigation'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { GovernanceOverviewView as LockedVoter } from '@/components/tribeca/overview/locked-voter'
import { GovernanceOverviewView as NftVoter } from '@/components/tribeca/overview/nft-voter'

export default function GovernanceOverviewPage() {
    const { manifest } = useGovernor()

    // Si no hay manifest, mostramos not-found.tsx
    if (!manifest) {
        notFound()
    }

    // Si hay manifest, determinamos el tipo de votación
    if (manifest.mndeNftLocker) {
        return <NftVoter />
    } else {
        return <LockedVoter />
    }
}