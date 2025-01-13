'use client'

import { usePubkey } from '@rockooor/sail'
import { useState } from 'react'

import { Card } from '@/components/tribeca/Card'
import { InputText } from '@/components/tribeca/inputs/InputText'
import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import { useParsedOperator, useParsedRewarder } from '@/utils/tribeca/parsers'
import { CreateGaugemeisterModal } from '@/components/tribeca/gauges/CreateGaugemeisterModal'

/**
 * Card component for setting up gauge system configuration
 */
function SetupGaugesCard() {
    const [rewarderKeyStr, setRewarderKeyStr] = useState<string>('')
    const rewarderKey = usePubkey(rewarderKeyStr)

    const [startTime, setStartTime] = useState<string>(
        new Date().toISOString().split('Z')[0] ?? ''
    )

    const { data: rewarder } = useParsedRewarder(rewarderKey)
    const { data: operator } = useParsedOperator(
        rewarder?.accountInfo.data.authority
    )

    const disabledReason = !rewarder
        ? 'Rewarder does not exist'
        : !operator
            ? 'Must be operator'
            : null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleRewarderKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRewarderKeyStr(e.target.value)
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(e.target.value)
    }

    return (
        <Card title="Setup Gauges">
            <div className="px-7 py-4 text-sm">
                <p className="mb-4">
                    Gauges allow DAO members to vote on where they want liquidity mining
                    rewards to exist.
                </p>
                <form 
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <label 
                        className="flex flex-col gap-1" 
                        htmlFor="rewarderKey"
                    >
                        <span className="text-sm">Rewarder Key</span>
                        <InputText
                            id="rewarderKey"
                            type="text"
                            placeholder="Your Quarry Rewarder."
                            value={rewarderKeyStr}
                            onChange={handleRewarderKeyChange}
                        />
                    </label>
                    <label 
                        className="flex flex-col gap-1" 
                        htmlFor="startTime"
                    >
                        <span className="text-sm">First Epoch Start Time</span>
                        <InputText
                            id="startTime"
                            type="datetime-local"
                            placeholder="Your Quarry Rewarder."
                            value={startTime}
                            onChange={handleStartTimeChange}
                        />
                    </label>
                    <ModalButton
                        buttonLabel={disabledReason ?? 'Create Gaugemeister'}
                        buttonProps={{
                            disabled: !!disabledReason,
                        }}
                    >
                        {operator && rewarder && (
                            <CreateGaugemeisterModal
                                rewarder={rewarder}
                                operator={operator}
                                startTime={new Date(startTime)}
                            />
                        )}
                    </ModalButton>
                </form>
            </div>
        </Card>
    )
}

export { SetupGaugesCard }