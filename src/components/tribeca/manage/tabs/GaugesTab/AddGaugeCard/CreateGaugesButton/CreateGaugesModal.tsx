'use client'

import { findGaugeAddress, GaugeSDK } from '@quarryprotocol/gauge'
import { useRewarder } from '@rockooor/react-quarry'
import { useSail } from '@rockooor/sail'
import { TransactionEnvelope } from '@saberhq/solana-contrib'
import invariant from 'tiny-invariant'

import { ModalInner } from '@/components/tribeca/Modal/ModalInner'
import { useModal } from '@/components/tribeca/Modal/context'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

/**
 * Modal component for creating new gauges for quarries
 */
function CreateGaugesModal() {
    const { sdkMut } = useSDK()
    const { quarries } = useRewarder()
    const gaugemeister = useGaugemeister()
    const { handleTXs, refetchMany } = useSail()
    const { wrapTx } = useWrapTx()
    const { close } = useModal()

    const create = async () => {
        invariant(sdkMut && gaugemeister)
        const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider })

        const allGaugeKeys = await Promise.all(
            quarries?.map(async (quarry) => {
                const [gaugeKey] = await findGaugeAddress(gaugemeister, quarry.key)
                return gaugeKey
            }) ?? []
        )
        const gaugesData = await refetchMany(allGaugeKeys)

        const createTXs = await Promise.all(
            quarries?.map(async (quarry, i) => {
                // don't create gauges that already exist
                if (gaugesData[i]) {
                    return null
                }
                const { tx: createGaugeTX } = await gaugeSDK.gauge.createGauge({
                    gaugemeister,
                    quarry: quarry.key,
                })
                return createGaugeTX
            }) ?? []
        )
        const bigEnvelope = TransactionEnvelope.combineAll(
            ...createTXs.filter((tx): tx is TransactionEnvelope => !!tx)
        )
        const { pending, success } = await handleTXs(
            await wrapTx(bigEnvelope.partition()),
            `Create ${createTXs.length} Gauges`
        )
        if (!success) {
            return
        }
        await Promise.all(pending.map((p) => p.wait({ useWebsocket: true })))
        close()
    }

    return (
        <ModalInner
            title="Create Gauges"
            buttonProps={{
                onClick: create,
                variant: 'primary',
                children: 'Create Gauges',
            }}
        >
            <div className="px-8 flex flex-col items-center">
                <p className="mb-4 text-sm">Create Gauges for missing Quarries.</p>
            </div>
        </ModalInner>
    )
}

export { CreateGaugesModal }