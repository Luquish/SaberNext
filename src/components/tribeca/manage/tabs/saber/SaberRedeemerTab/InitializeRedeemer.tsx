'use client'

import { useQuarrySDK } from '@rockooor/react-quarry'
import { useSail } from '@rockooor/sail'
import { Saber, SABER_IOU_MINT, SBR_ADDRESS } from '@saberhq/saber-periphery'
import type { PublicKey } from '@solana/web3.js'

import { AddressLink } from '@/components/tribeca/AddressLink'
import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { Card } from '@/components/tribeca/Card'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface InitializeRedeemerProps {
    iouMint?: PublicKey
}

/**
 * Component for initializing a new redeemer for a given IOU mint
 */
function InitializeRedeemer({ iouMint = SABER_IOU_MINT }: InitializeRedeemerProps) {
    const { sdkMut } = useQuarrySDK()
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    return (
        <Card title="Initialize Redeemer" padded>
            <p>
                Redeemer does not yet exist for <AddressLink address={iouMint} />.
            </p>
            <AsyncButton
                disabled={!sdkMut}
                onClick={async (sdkMut) => {
                    const redeemerSDK = Saber.load({ provider: sdkMut.provider })
                    const { tx } = await redeemerSDK.createRedeemer({
                        iouMint,
                        redemptionMint: SBR_ADDRESS,
                    })
                    await handleTX(await wrapTx(tx), 'Create Redeemer')
                }}
            >
                Initialize
            </AsyncButton>
        </Card>
    )
}

export { InitializeRedeemer }