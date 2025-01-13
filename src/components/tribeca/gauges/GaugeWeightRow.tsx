'use client'

import {
    findGaugeAddress,
    findGaugeVoteAddress,
    findGaugeVoterAddress,
} from '@quarryprotocol/gauge'
import type { QuarryInfo } from '@rockooor/react-quarry'
import { useToken } from '@rockooor/sail'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import invariant from 'tiny-invariant'

import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { InputText } from '@/components/tribeca/inputs/InputText'
import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useUpdateGaugeWeights } from '@/hooks/tribeca/gauges/useUpdateGaugeWeights'
import { FORMAT_VOTE_PERCENT } from '@/utils/tribeca/format'
import { useGaugeVoteData } from '@/utils/tribeca/parsers'
import { useGaugemeister } from '@/hooks/tribeca/gauges/useGaugemeister'

interface GaugeWeightRowProps {
    quarry: QuarryInfo
}

/**
 * Row component for displaying and managing individual gauge weights
 */
function GaugeWeightRow({ quarry }: GaugeWeightRowProps) {
    const { data: stakedToken } = useToken(quarry.quarry.account.tokenMintKey)
    const { escrowKey } = useUserEscrow()
    const gaugemeister = useGaugemeister()

    const { data: gaugeKey } = useQuery({
        queryKey: ['gaugeKey', gaugemeister?.toString(), quarry.key.toString()],
        queryFn: async () => {
            invariant(gaugemeister)
            const [gauge] = await findGaugeAddress(gaugemeister, quarry.key)
            return gauge
        },
        enabled: !!gaugemeister,
    })

    const { data: gaugeVoterKeys } = useQuery({
        queryKey: ['gaugeVoterKeys', gaugeKey?.toString(), escrowKey?.toString()],
        queryFn: async () => {
            invariant(escrowKey && gaugeKey && gaugemeister)
            const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey)
            const [gaugeVote] = await findGaugeVoteAddress(gaugeVoter, gaugeKey)
            return { gaugeVoter, gaugeVote }
        },
        enabled: !!escrowKey && !!gaugeKey,
    })

    const gaugeVoteKey = gaugeVoterKeys?.gaugeVote
    const { data: gaugeVote } = useGaugeVoteData(gaugeVoteKey)

    const {
        currentTotalShares,
        nextShares,
        nextTotalShares,
        nextSharesRaw,
        setTokenShareStr,
    } = useUpdateGaugeWeights()

    const nextShare = nextShares[quarry.quarry.account.tokenMintKey.toString()]
    const currentShare = gaugeVote ? gaugeVote.account.weight : null

    useEffect(() => {
        if (currentShare) {
            setTokenShareStr(
                quarry.quarry.account.tokenMintKey,
                currentShare,
                currentShare.toString(),
            )
        }
    }, [currentShare, quarry.quarry.account.tokenMintKey, setTokenShareStr])

    const percent = nextTotalShares ? (nextShare ?? 0) / nextTotalShares : null
    const currentSharePercent = currentShare !== null && currentTotalShares
        ? currentShare / currentTotalShares
        : null

    return (
        <tr>
            <td>
                <div className="flex gap-2 items-center">
                    <TokenIcon token={stakedToken} />
                    {stakedToken?.name ?? <ContentLoader className="h-3 w-10" />}
                </div>
            </td>
            <td>
                {currentSharePercent !== null
                    ? FORMAT_VOTE_PERCENT.format(currentSharePercent)
                    : '--'}
            </td>
            <td>
                <InputText
                    value={
                        nextSharesRaw[quarry.quarry.account.tokenMintKey.toString()]
                            ?.value ?? ''
                    }
                    onChange={(e) => {
                        setTokenShareStr(
                            quarry.quarry.account.tokenMintKey,
                            currentShare ?? 0,
                            e.target.value,
                        )
                    }}
                />
            </td>
            <td>{percent !== null ? FORMAT_VOTE_PERCENT.format(percent) : '--'}</td>
        </tr>
    )
}

export { GaugeWeightRow }