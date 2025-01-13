'use client'

import { findGaugeAddress, GaugeSDK } from '@quarryprotocol/gauge'
import type { QuarryInfo } from '@rockooor/react-quarry'
import { useSail, useToken } from '@rockooor/sail'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { AddressLink } from '@/components/tribeca/AddressLink'
import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { Button } from '@/components/tribeca/Button'
import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { Toggle } from '@/components/tribeca/Toggle'
import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useProvider } from '@/hooks/tribeca/useProvider'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { useGaugeData } from '@/utils/tribeca/parsers'

interface GaugeInfoProps {
    quarry: QuarryInfo
}

/**
 * Component for displaying and managing gauge information for a quarry
 */
function GaugeInfo({ quarry }: GaugeInfoProps) {
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()
    const { ownerInvokeTX, ownerInvokerKey } = useExecutiveCouncil()
    const { providerMut, newTX } = useProvider()
    const { gauge: gaugeSettings } = useGovernor()
    const { data: gaugeKey } = useQuery({
        queryKey: [
            'gaugeKey',
            gaugeSettings?.gaugemeister.toString(),
            quarry.key.toString(),
        ],
        queryFn: async () => {
            invariant(gaugeSettings)
            const [key] = await findGaugeAddress(
                gaugeSettings.gaugemeister,
                quarry.key
            )
            return key
        },
        enabled: !!gaugeSettings,
    })
    const { data: gauge } = useGaugeData(gaugeKey)
    const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey)

    return (
        <tr>
            <td>
                <div className="flex gap-2 items-center">
                    <TokenIcon token={stakedToken} />
                    {stakedToken?.name ?? <ContentLoader className="h-3 w-10" />}
                </div>
            </td>
            <td>
                <AddressLink address={quarry.quarry.account.tokenMintKey} showCopy />
            </td>
            <td>
                {gauge ? (
                    <Toggle
                        label={gauge.account.isDisabled ? 'Enable Gauge' : 'Disable Gauge'}
                        checked={!gauge.account.isDisabled}
                        onChange={async () => {
                            invariant(
                                gaugeKey && gaugeSettings && providerMut && ownerInvokerKey
                            )
                            const gaugeSDK = GaugeSDK.load({ provider: providerMut })

                            if (gauge.account.isDisabled) {
                                const enableGaugeTX = await gaugeSDK.gauge.enableGauge({
                                    gauge: gaugeKey,
                                })
                                await ownerInvokeTX(enableGaugeTX, 'Enable Gauge')
                            } else {
                                const disableGaugeTX = newTX([
                                    await gaugeSDK.gauge.program.methods
                                        .gaugeDisable()
                                        .accounts({
                                            gaugemeister: gaugeSettings.gaugemeister,
                                            gauge: gaugeKey,
                                            foreman: ownerInvokerKey,
                                        })
                                        .instruction(),
                                ])
                                await ownerInvokeTX(disableGaugeTX, 'Disable Gauge')
                            }
                        }}
                    />
                ) : (
                    <span className="text-gray-400">Not found</span>
                )}
            </td>
            <td>
                <div className="flex gap-4">
                    {gauge ? (
                        <Button disabled>
                            {gauge === undefined ? <LoadingSpinner /> : 'Already Created'}
                        </Button>
                    ) : (
                        <AsyncButton
                            disabled={!gaugeSettings}
                            onClick={async (sdkMut) => {
                                invariant(gaugeSettings)
                                const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider })
                                const { tx: createGaugeTX } = await gaugeSDK.gauge.createGauge({
                                    gaugemeister: gaugeSettings.gaugemeister,
                                    quarry: quarry.key,
                                })
                                await handleTX(await wrapTx(createGaugeTX), 'Create Gauge')
                            }}
                        >
                            Add Gauge
                        </AsyncButton>
                    )}
                </div>
            </td>
        </tr>
    )
}

export { GaugeInfo }