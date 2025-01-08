'use client'

import { Card } from '@/components/tribeca/Card'

interface LockupDetailsProps {
    className?: string
}

/**
 * Component that displays lockup details
 */
function LockupDetails({ className }: LockupDetailsProps) {
    return <Card className={className} />
}

export { LockupDetails }