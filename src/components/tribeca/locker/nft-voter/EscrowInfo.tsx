'use client'

import { Card } from '@/components/tribeca/Card'

interface EscrowInfoProps {
    className?: string
}

/**
 * Component that displays voting wallet information in a card
 */
function EscrowInfo({ className }: EscrowInfoProps) {
    return <Card className={className} title="Voting Wallet" />
}

export { EscrowInfo }