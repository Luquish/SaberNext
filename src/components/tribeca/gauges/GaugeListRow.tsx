'use client'

import type { GaugeData } from '@quarryprotocol/gauge'
import { findEpochGaugeAddress } from '@quarryprotocol/gauge'
import type { QuarryInfo } from '@rockooor/react-quarry'
import { useRewarder } from '@rockooor/react-quarry'
import { useToken } from '@rockooor/sail'
import type { ProgramAccount } from '@saberhq/token-utils'
import { Fraction, Percent, TokenAmount } from '@saberhq/token-utils'
import { useQuery } from '@tanstack/react-query'
import BN from 'bn.js'
import { FaExclamationCircle, FaExternalLinkAlt } from 'react-icons/fa'
import invariant from 'tiny-invariant'
import { useMemo } from 'react'
import { IoTriangle } from 'react-icons/io5'
import { MdHorizontalRule } from 'react-icons/md'

import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { MouseoverTooltip } from '@/components/tribeca/MouseoverTooltip'
import { TokenAmountDisplay } from '@/components/tribeca/TokenAmountDisplay'
import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useGM } from '@/contexts/tribeca/gauges'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useParsedEpochGauge } from '@/utils/tribeca/parsers'


interface GaugeListRowProps {
    quarry: QuarryInfo
    gauge: ProgramAccount<GaugeData>
    totalShares: BN | null
    dailyRewardsRate: BN | null | undefined
    currentRank: number
    nextRank: number | null
}

/**
 * Row in the "All Gauges" section of the Gauges homepage.
 */
function GaugeListRow({
    quarry,
    gauge: {
        publicKey: gaugeKey,
        account: { isDisabled },
    },
    totalShares,
    dailyRewardsRate,
    currentRank,
    nextRank,
}: GaugeListRowProps) {
    const { votingEpoch: rawVotingEpoch } = useGM()
    const { veToken } = useGovernor()
    const { network } = useEnvironment()

    const votingEpoch = useMemo(() => {
        if (typeof rawVotingEpoch === 'number') {
            return rawVotingEpoch
        }
        return rawVotingEpoch?.account.currentRewardsEpoch ?? null
    }, [rawVotingEpoch])

    const { data: epochGaugeKey } = useQuery({
        queryKey: ['epochGaugeKey', gaugeKey.toString()],
        queryFn: async () => {
            invariant(votingEpoch !== null, 'votingEpoch must be defined')
            const [key] = await findEpochGaugeAddress(gaugeKey, votingEpoch)
            return key
        },
        enabled: votingEpoch !== null,
    })

    const { data: epochGauge } = useParsedEpochGauge(epochGaugeKey)
    const { rewardToken, rewarder, rewarderKey } = useRewarder()
    const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey)

    const rewardsRate = rewardToken 
        ? new TokenAmount(
            rewardToken,
            quarry.quarry.account.annualRewardsRate.div(new BN(365))
        )
        : null

    const percent = rewarder
        ? new Percent(
            quarry.quarry.account.rewardsShare,
            rewarder.account.totalRewardsShares
        )
        : null

    const nextPercent = epochGauge && totalShares
        ? new Percent(epochGauge.accountInfo.data.totalPower, totalShares)
        : null

    const nextRewardsRate = rewardToken && dailyRewardsRate && epochGauge && totalShares
        ? new TokenAmount(
            rewardToken,
            dailyRewardsRate
                .mul(epochGauge.accountInfo.data.totalPower)
                .div(totalShares)
        )
        : null

    const quarryLink = `https://${
        network === 'mainnet-beta'
            ? 'app'
            : network === 'devnet'
                ? 'devnet'
                : network === 'testnet'
                    ? 'testnet'
                    : 'app'
    }.quarry.so/#/rewarders/${rewarderKey.toString()}/quarries/${quarry.key.toString()}`

    const delta = nextRank === null ? null : nextRank - currentRank

    return (
        <tr>
            <td>
                {!isDisabled && (
                    <div className="flex items-center gap-2.5 w-full">
                        <div className="w-3 h-3 flex items-center">
                            <MouseoverTooltip
                                text={
                                    <div className="flex flex-col gap-2">
                                        <p>Previous Rank: {currentRank}</p>
                                        <p>
                                            Next Rank: {nextRank} (
                                            {delta === null
                                                ? '??'
                                                : delta > 0
                                                    ? `-${delta}`
                                                    : delta < 0
                                                        ? `+${-delta}`
                                                        : '+0'}
                                            )
                                        </p>
                                    </div>
                                }
                            >
                                {delta === null ? (
                                    <></>
                                ) : delta > 0 ? (
                                    <IoTriangle className="w-3 h-3 rotate-180 text-red-500" />
                                ) : delta < 0 ? (
                                    <IoTriangle className="w-3 h-3 text-saber" />
                                ) : (
                                    <MdHorizontalRule className="w-3 h-3 text-neutral-600" />
                                )}
                            </MouseoverTooltip>
                        </div>
                        <div className="text-white font-bold">{nextRank}</div>
                    </div>
                )}
            </td>
            <td>
                <div className="flex gap-2 items-center h-10">
                    <TokenIcon token={stakedToken} />
                    {isDisabled ? (
                        <MouseoverTooltip text="Voting for this gauge is currently disabled.">
                            <div className="flex gap-2 items-center">
                                <FaExclamationCircle className="text-red-500 cursor-pointer" />
                                <a
                                    className="font-medium line-through text-slate-600"
                                    href={quarryLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {stakedToken?.name ?? <ContentLoader className="h-3 w-10" />}
                                </a>
                            </div>
                        </MouseoverTooltip>
                    ) : (
                        <a
                            className="font-medium hover:underline"
                            href={quarryLink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {stakedToken?.name ?? <ContentLoader className="h-3 w-10" />}
                        </a>
                    )}
                    {stakedToken?.info.extensions?.website && (
                        <a
                            className="text-saber hover:text-white transition-colors"
                            href={stakedToken.info.extensions.website}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FaExternalLinkAlt />
                        </a>
                    )}
                </div>
            </td>
            <td>
                <div className="flex flex-col gap-1">
                    <span className="text-white font-medium">
                        {percent?.toFixed(2)}%{' '}
                        <span className="text-warmGray-400 font-normal">
                            (
                            {(votingEpoch && votingEpoch > 1 && veToken
                                ? new TokenAmount(
                                    veToken,
                                    quarry.quarry.account.rewardsShare
                                ).toFixed(0, { groupSeparator: ',' })
                                : new Fraction(quarry.quarry.account.rewardsShare).toFixed(0, {
                                    groupSeparator: ',',
                                })
                            ).toLocaleString()}
                            )
                        </span>
                    </span>
                    <span className="text-xs">
                        {rewardsRate && (
                            <TokenAmountDisplay amount={rewardsRate} suffix="/day" />
                        )}
                    </span>
                </div>
            </td>
            <td>
                <div className="flex flex-col gap-1">
                    <span className="text-white font-medium">
                        {nextPercent?.toFixed(2)}%{' '}
                        <span className="text-warmGray-400 font-normal">
                            (
                            {epochGauge && veToken
                                ? new TokenAmount(
                                    veToken,
                                    epochGauge.accountInfo.data.totalPower
                                ).toExact({
                                    groupSeparator: ',',
                                })
                                : '--'}
                            )
                        </span>
                    </span>
                    <span className="text-xs">
                        {nextRewardsRate && (
                            <TokenAmountDisplay amount={nextRewardsRate} suffix="/day" />
                        )}
                    </span>
                </div>
            </td>
        </tr>
    )
}

export { GaugeListRow }