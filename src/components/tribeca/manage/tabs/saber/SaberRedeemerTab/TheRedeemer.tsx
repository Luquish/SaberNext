'use client'

import { usePubkey } from '@rockooor/sail'
import { useParams } from 'next/navigation'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { InitializeRedeemer } from './InitializeRedeemer'
import { RedeemerAllowance } from './RedeemerAllowance'
import { useRedeemer } from './useRedeemer'

/**
 * Component that displays and manages the Saber redeemer information
 */
function TheRedeemer() {
    const params = useParams<{ iouMint: string }>()
    const iouMint = usePubkey(params.iouMint)
    const { data: redeemer } = useRedeemer(iouMint ?? undefined)

    if (redeemer === undefined) {
        return <LoadingPage />
    }

    return (
        <div className="flex flex-col gap-4">
            {redeemer === null ? (
                <InitializeRedeemer iouMint={iouMint ?? undefined} />
            ) : (
                <>
                    <Card title="Redeemer">
                        <AttributeList
                            loading={redeemer === undefined}
                            attributes={{
                                Key: redeemer?.publicKey,
                                'IOU Mint': redeemer?.account.iouMint,
                                'Redemption Mint': redeemer?.account.redemptionMint,
                                'Redemption Vault': redeemer?.account.redemptionVault,
                            }}
                        />
                    </Card>
                    <RedeemerAllowance redeemer={redeemer.publicKey} />
                </>
            )}
        </div>
    )
}

export { TheRedeemer }