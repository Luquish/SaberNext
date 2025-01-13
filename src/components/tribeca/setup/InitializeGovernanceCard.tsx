'use client'

import { Token } from '@saberhq/token-utils'
import type {
    GovernanceParameters,
    LockerParams,
} from '@tribecahq/tribeca-sdk'
import BN from 'bn.js'
import { useMemo } from 'react'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import type { GovernorInfo } from '@/hooks/tribeca/useGovernor'
import { formatDurationSeconds } from '@/utils/tribeca/format'

interface InitializeGovernanceCardProps {
    info: GovernorInfo
}

/**
 * Card component for initializing and displaying DAO governance parameters
 */
function InitializeGovernanceCard({ info }: InitializeGovernanceCardProps) {
    const { manifest } = info

    const underlyingToken = manifest
        ? new Token(manifest.governance.token)
        : manifest

    const { lockerParams, governorParams } = useMemo(() => {
        if (!manifest) {
            return { lockerParams: manifest, governorParams: manifest }
        }
        const { locker, governor } = manifest.governance.parameters ?? {}
        
        const lockerParams: LockerParams | null = locker
            ? {
                whitelistEnabled: locker.whitelistEnabled,
                maxStakeVoteMultiplier: locker.maxStakeVoteMultiplier,
                minStakeDuration: new BN(locker.minStakeDuration),
                maxStakeDuration: new BN(locker.maxStakeDuration),
                proposalActivationMinVotes: new BN(locker.proposalActivationMinVotes),
            }
            : null

        const governorParams: GovernanceParameters | null = governor
            ? {
                votingDelay: new BN(governor.votingDelay),
                votingPeriod: new BN(governor.votingPeriod),
                quorumVotes: new BN(governor.quorumVotes),
                timelockDelaySeconds: new BN(governor.timelockDelay),
            }
            : null

        return { lockerParams, governorParams }
    }, [manifest])

    return (
        <div>
            <Card className="mt-8" title="Initialize DAO">
                {underlyingToken === undefined && <LoadingPage />}
                {underlyingToken && (
                    <div>
                        <p>Set up your DAO.</p>
                        {governorParams && (
                            <div>
                                <h2>Governor</h2>
                                <AttributeList
                                    transformLabel={false}
                                    attributes={{
                                        'Votes for Quorum':
                                            (governorParams as GovernanceParameters).quorumVotes.toNumber() /
                                            10 ** (underlyingToken as Token).decimals,
                                        'Timelock Delay (seconds)': formatDurationSeconds(
                                            (governorParams as GovernanceParameters).timelockDelaySeconds.toNumber()
                                        ),
                                        'Voting Delay': formatDurationSeconds(
                                            (governorParams as GovernanceParameters).votingDelay.toNumber()
                                        ),
                                        'Voting Period': formatDurationSeconds(
                                            (governorParams as GovernanceParameters).votingPeriod.toNumber()
                                        ),
                                    }}
                                />
                            </div>
                        )}
                        {lockerParams && (
                            <div>
                                <h2>Vote Escrow Locker</h2>
                                <AttributeList
                                    transformLabel={false}
                                    attributes={{
                                        'Membership Token': underlyingToken,
                                        'Min Stake Duration': formatDurationSeconds(
                                            (lockerParams as LockerParams).minStakeDuration.toNumber()
                                        ),
                                        'Max Stake Duration': formatDurationSeconds(
                                            (lockerParams as LockerParams).maxStakeDuration.toNumber()
                                        ),
                                        'Max Vote Multiplier': (lockerParams as LockerParams).maxStakeVoteMultiplier,
                                        'Votes to Activate a Proposal':
                                            (lockerParams as LockerParams).proposalActivationMinVotes.toNumber() /
                                            10 ** (underlyingToken as Token).decimals,
                                        'CPI Whitelist Enabled?': (lockerParams as LockerParams).whitelistEnabled,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}

export { InitializeGovernanceCard }