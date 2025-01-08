'use client'

import { findEpochGaugeVoteAddress } from '@quarryprotocol/gauge'
import { useQuarryData } from '@rockooor/react-quarry'
import { useToken } from '@rockooor/sail'
import { TokenAmount } from '@saberhq/token-utils'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { Meter } from '@/components/tribeca/Meter'
import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { FORMAT_VOTE_PERCENT } from '@/utils/tribeca/format'
import { useGaugeData, useParsedEpochGaugeVote } from '@/utils/tribeca/parsers'
import { theme } from '@/theme/tribeca'
import { useGMData } from '@/hooks/tribeca/gauges/useGaugemeister'
import type { UserGaugeInfo } from '@/hooks/tribeca/gauges/useMyGauges'
import { CommitVotesButton } from './CommitVotesButton'

interface UserGaugeProps {
    className?: string
    owner?: PublicKey
    gaugeVote: UserGaugeInfo
}

/**
 * Component displaying user's gauge voting information
 */
function UserGauge({ className, gaugeVote, owner }: UserGaugeProps) {
    const { data: gm } = useGMData()
    const { data: gauge } = useGaugeData(gaugeVote.gauge)
    const { data: quarry } = useQuarryData(gauge?.account.quarry)
    const { veToken } = useGovernor()
    const { data: stakedToken } = useToken(quarry?.account.tokenMintKey)

    const { data: epochGaugeVoteKey } = useQuery({
        queryKey: [
            'epochGaugeVoteKey',
            gaugeVote.gauge.toString(),
            gm?.publicKey.toString(),
        ],
        queryFn: async () => {
            invariant(gm, 'Gaugemeister must be present')
            const [key] = await findEpochGaugeVoteAddress(
                gaugeVote.key,
                gm.account.currentRewardsEpoch + 1
            )
            return key
        },
        enabled: !!gm,
    })

    const { data: epochGaugeVote } = useParsedEpochGaugeVote(epochGaugeVoteKey)

    const renderTokenAmount = () => {
        if (epochGaugeVote && veToken) {
            return new TokenAmount(
                veToken,
                epochGaugeVote.accountInfo.data.allocatedPower
            ).formatUnits()
        }

        if (epochGaugeVote === undefined) {
            return <ContentLoader className="w-20 h-4" />
        }

        return <CommitVotesButton owner={owner} />
    }

    const renderVotePercentage = () => {
        return gaugeVote.percent !== null
            ? FORMAT_VOTE_PERCENT.format(gaugeVote.percent)
            : '--'
    }

    return (
        <tr className={className}>
            <td>
                <div className="flex items-center gap-2">
                    <TokenIcon token={stakedToken} />
                    <div>
                        {stakedToken ? (
                            <span>{stakedToken.name}</span>
                        ) : (
                            <ContentLoader className="w-32 h-4" />
                        )}
                    </div>
                </div>
            </td>
            <td>{renderTokenAmount()}</td>
            <td>
                <div className="flex items-center">
                    <div className="w-16">
                        <Meter
                            value={gaugeVote.percent ?? 0}
                            max={1}
                            barColor={theme.gen.brand.base}
                        />
                    </div>
                    <div className="ml-2">
                        {renderVotePercentage()}
                    </div>
                </div>
            </td>
        </tr>
    )
}

export { UserGauge }