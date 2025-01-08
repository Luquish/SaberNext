'use client'

import type { RewarderData } from '@quarryprotocol/quarry-sdk'
import {
    useMintWrapperData,
    useOperatorData,
    useRewarderConfig,
} from '@rockooor/react-quarry'
import { useToken } from '@rockooor/sail'
import type { ProgramAccount } from '@saberhq/token-utils'
import { TokenAmount } from '@saberhq/token-utils'
import BN from 'bn.js'

import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'

interface RewarderCardProps {
    rewarder: ProgramAccount<RewarderData>
}

/**
 * Card component displaying rewarder information and configuration
 */
function RewarderCard({ rewarder }: RewarderCardProps) {
    const { data: rewarderConfig } = useRewarderConfig(
        rewarder.publicKey.toString()
    )
    const rewarderInfo = rewarderConfig?.info
    const { data: rewardsToken } = useToken(
        rewarderConfig?.info?.redeemer?.underlyingToken ??
            rewarderConfig?.rewardsToken.mint
    )
    const dailyRewardsRate = rewardsToken
        ? new TokenAmount(
            rewardsToken,
            rewarder.account.annualRewardsRate.div(new BN(365))
        )
        : null
    const { network } = useEnvironment()

    const rewarderLink = `https://${
        network === 'mainnet-beta'
            ? 'app'
            : network === 'devnet'
                ? 'devnet'
                : network === 'testnet'
                    ? 'testnet'
                    : 'app'
    }.quarry.so/#/rewarders/${rewarder.publicKey.toString()}/quarries`

    const { data: mintWrapperData } = useMintWrapperData(
        rewarder.account.mintWrapper
    )
    const { data: operatorData } = useOperatorData(rewarder.account.authority)

    return (
        <tr>
            <td>
                <h3>
                    <a href={rewarderLink} target="_blank" rel="noreferrer">
                        {rewarderInfo?.name ?? rewarder.publicKey.toString()}
                    </a>
                </h3>
                <span>
                    {rewarderConfig?.quarries.length.toLocaleString() ?? '--'} quarries
                </span>
            </td>
            <td>
                <div className="flex items-center gap-4">
                    <TokenIcon token={rewardsToken} />
                    <div className="flex flex-col">
                        <span className="text-white">
                            {dailyRewardsRate?.formatUnits() ?? '--'}/day
                        </span>
                        <span>{rewardsToken?.name}</span>
                    </div>
                </div>
            </td>
            <td>
                <ul>
                    <li>
                        Mint Wrapper Authority: {mintWrapperData?.account.admin.toString()}
                    </li>
                    <li>Operator Admin: {operatorData?.account.admin.toString()}</li>
                    <li>
                        Quarry Creator: {operatorData?.account.quarryCreator.toString()}
                    </li>
                    <li>
                        Share Allocator: {operatorData?.account.shareAllocator.toString()}
                    </li>
                    <li>Rate Setter: {operatorData?.account.rateSetter.toString()}</li>
                </ul>
            </td>
        </tr>
    )
}

export { RewarderCard }