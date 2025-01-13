'use client'

import { GaugeSDK } from '@quarryprotocol/gauge'
import type { OperatorData, RewarderData } from '@quarryprotocol/quarry-sdk'
import type { ParsedAccountInfo } from '@rockooor/sail'
import { useSail } from '@rockooor/sail'
import invariant from 'tiny-invariant'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { ModalInner } from '@/components/tribeca/Modal/ModalInner'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'

interface CreateGaugemeisterModalProps {
    operator: ParsedAccountInfo<OperatorData>
    rewarder: ParsedAccountInfo<RewarderData>
    startTime: Date
}

/**
 * Modal component for creating a new Gaugemeister
 */
function CreateGaugemeisterModal({ 
    operator, 
    rewarder, 
    startTime, 
}: CreateGaugemeisterModalProps) {
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()
    const { lockerData } = useGovernor()
    const { sdkMut } = useSDK()

    const handleCreate = async () => {
        invariant(sdkMut && lockerData, 'SDK and locker data must be present')
        
        const gauge = GaugeSDK.load({ provider: sdkMut.provider })
        const { gaugemeister, tx: createGMTX } = await gauge.gauge.createGaugemeister({
            firstEpochStartsAt: startTime,
            locker: lockerData.publicKey,
            operator: operator.accountId,
        })

        const { pending, success } = await handleTX(
            await wrapTx(createGMTX),
            `Create Gaugemeister at ${gaugemeister.toString()}`
        )

        if (!pending || !success) {
            return
        }

        await pending.wait()
    }

    return (
        <ModalInner
            title="Create Gaugemeister"
            buttonProps={{
                onClick: handleCreate,
                variant: 'primary',
                children: 'Create Gaugemeister',
            }}
        >
            <div className="px-8 flex flex-col items-center">
                <p className="mb-4 text-sm">Set up your gauge system.</p>
                <AttributeList
                    attributes={{
                        Rewarder: rewarder.accountId,
                        Operator: operator.accountId,
                        'Start Time': startTime.toLocaleString(undefined, {
                            timeZoneName: 'short',
                        }),
                    }}
                />
            </div>
        </ModalInner>
    )
}

export { CreateGaugemeisterModal }