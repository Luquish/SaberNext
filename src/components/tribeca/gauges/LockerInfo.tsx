'use client'

import { TokenAmount } from '@saberhq/token-utils'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { formatDurationSeconds } from '@/utils/tribeca/format'

/**
 * Component that displays information about the governance token locker
 */
function LockerInfo() {
    const { lockerData, minActivationThreshold, govToken } = useGovernor()

    const totalLocked = govToken && lockerData
        ? new TokenAmount(govToken, lockerData.account.lockedSupply)
        : lockerData?.account.lockedSupply

    return (
        <Card title="Locker">
            <AttributeList
                transformLabel={false}
                attributes={{
                    Locker: lockerData?.publicKey,
                    'Total Locked': totalLocked,
                    'Governance Token': govToken,
                    'Min Stake Duration': lockerData
                        ? formatDurationSeconds(
                            lockerData.account.params.minStakeDuration.toNumber(),
                        )
                        : lockerData,
                    'Max Stake Duration': lockerData
                        ? formatDurationSeconds(
                            lockerData.account.params.maxStakeDuration.toNumber(),
                        )
                        : lockerData,
                    'Max Vote Multiplier': lockerData?.account.params.maxStakeVoteMultiplier,
                    'Votes to Activate a Proposal': minActivationThreshold,
                }}
            />
        </Card>
    )
}

export { LockerInfo }