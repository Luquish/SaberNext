'use client'

import type { GaugeData } from '@quarryprotocol/gauge'
import { GaugeSDK } from '@quarryprotocol/gauge'
import type { BatchedParsedAccountQueryData } from '@rockooor/sail'
import { useSail } from '@rockooor/sail'
import { TransactionEnvelope } from '@saberhq/solana-contrib'
import invariant from 'tiny-invariant'

import { ModalInner } from '@/components/tribeca/Modal/ModalInner'
import { useModal } from '@/components/tribeca/Modal/context'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface EnableAllGaugesModalProps {
    gauges?: BatchedParsedAccountQueryData<GaugeData>
}

/**
 * Modal component for enabling all disabled gauges
 */
function EnableAllGaugesModal({ gauges }: EnableAllGaugesModalProps) {
    const { sdkMut } = useSDK()
    const gaugemeister = useGaugemeister()
    const { handleTXs } = useSail()
    const { wrapTx } = useWrapTx()
    const { close } = useModal()

    const disabledGauges = gauges?.filter((g) => g?.account.isDisabled)

    const create = async () => {
        invariant(sdkMut && gaugemeister)
        const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider })

        const enableTXs = await Promise.all(
            disabledGauges?.map(async (gauge) => {
                if (!gauge) {
                    return null
                }
                const enableGaugeTX = await gaugeSDK.gauge.enableGauge({
                    gauge: gauge.publicKey,
                })
                return enableGaugeTX
            }) ?? []
        )
        const bigEnvelope = TransactionEnvelope.combineAll(
            ...enableTXs.filter((tx): tx is TransactionEnvelope => !!tx)
        )
        const { pending, success } = await handleTXs(
            await wrapTx(bigEnvelope.partition()),
            `Enable ${enableTXs.length} Gauges`
        )
        if (!success) {
            return
        }
        await Promise.all(pending.map((p) => p.wait({ useWebsocket: true })))
        close()
    }

    return (
        <ModalInner
            title={`Enable ${disabledGauges?.length ?? 0} Gauges`}
            buttonProps={{
                onClick: create,
                variant: 'primary',
                children: 'Enable All Gauges',
            }}
        >
            <div className="px-8 flex flex-col items-center">
                <p className="mb-4 text-sm">Enable all gauges that are currently disabled.</p>
            </div>
        </ModalInner>
    )
}

export { EnableAllGaugesModal }