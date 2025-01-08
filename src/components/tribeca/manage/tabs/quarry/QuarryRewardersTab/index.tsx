'use client'

import { useBatchedRewarders } from '@rockooor/react-quarry'
import { exists } from '@saberhq/solana-contrib'
import { FaHammer } from 'react-icons/fa'

import { AddressLink } from '@/components/tribeca/AddressLink'
import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { Card } from '@/components/tribeca/Card'
import { CardWithImage } from '@/components/tribeca/CardWithImage'
import { ProseSmall } from '@/components/tribeca/typography/Prose'
import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { RewarderCard } from './RewarderCard'

/**
 * Tab component for managing quarry rewarders and permissions
 */
function QuarryRewardersTab() {
    const { meta, daoName } = useGovernor()
    const allRewarderKeys = [
        meta?.quarry?.rewarder,
        ...(meta?.quarry?.additionalRewarders ?? []),
    ].filter(exists)

    const { data: allRewarders } = useBatchedRewarders(allRewarderKeys)
    const { ownerInvokerKey } = useExecutiveCouncil()

    return (
        <div className="flex flex-col gap-4">
            <Card title={`${daoName ?? 'DAO'} Rewards Programs`}>
                <div className="overflow-x-scroll whitespace-nowrap">
                    <TableCardBody
                        head={
                            <tr>
                                <th>Rewarder</th>
                                <th>Rewards</th>
                                <th>Roles</th>
                            </tr>
                        }
                    >
                        {allRewarders?.map((rewarder) => {
                            if (!rewarder) {
                                return null
                            }
                            return (
                                <RewarderCard
                                    key={rewarder?.publicKey.toString()}
                                    rewarder={rewarder}
                                />
                            )
                        })}
                    </TableCardBody>
                </div>
            </Card>
            <CardWithImage
                title="Manage your Quarries with Tribeca"
                image={
                    <div className="flex items-center justify-center h-full">
                        <FaHammer className="h-20 w-20" />
                    </div>
                }
            >
                <ProseSmall>
                    <p>
                        Grant your Executive Council{'\''}s owner invoker permissions to set
                        rates, create quarries, and allocate shares.
                    </p>
                    {ownerInvokerKey && (
                        <p>
                            Owner Invoker: <AddressLink address={ownerInvokerKey} showCopy />
                        </p>
                    )}
                </ProseSmall>
            </CardWithImage>
        </div>
    )
}

export { QuarryRewardersTab }