'use client'

import type { QuarryData } from '@quarryprotocol/quarry-sdk'
import type { QuarryInfo } from '@rockooor/react-quarry'
import { useRewarder } from '@rockooor/react-quarry'
import type { ProgramAccount } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import { mapValues } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'
import { createContainer } from 'unstated-next'

import { useUserEscrow } from '../useEscrow'
import { useAllGauges } from './useGauges'
import { useMyGauges } from './useMyGauges'

interface ShareDiff {
    quarryInfo: QuarryInfo
    quarry: ProgramAccount<QuarryData>
    prevShare?: string
    nextShare?: string
    prevShareParsed: number
    nextShareParsed: number | null
}

interface ShareState {
    currentShare: number
    value: string
}

/**
 * Internal hook for managing gauge weight updates
 */
function useUpdateGaugeWeightsInternal() {
    const { quarries } = useRewarder()
    const { gaugeVoter } = useMyGauges()
    const { escrowKey } = useUserEscrow()
    const { gaugeKeys } = useAllGauges()

    const [nextSharesRaw, setNextSharesRaw] = useState<Record<string, ShareState>>({})

    const setTokenShareStr = useCallback(
        (farmKey: PublicKey, currentShare: number, value: string) => {
            setNextSharesRaw((subs) => ({
                ...subs,
                [farmKey.toString()]: { currentShare, value },
            }))
        },
        [],
    )

    const sharesDiff: ShareDiff[] = useMemo(() => {
        return Object.entries(nextSharesRaw)
            .map(([stakedTokenMintStr, { currentShare: prevShare, value: nextShare }]): ShareDiff | null => {
                const quarryInfo = quarries?.find((quarry) =>
                    quarry.quarry.account.tokenMintKey.equals(
                        new PublicKey(stakedTokenMintStr),
                    ),
                )
                const quarry = quarryInfo?.quarry
                if (!quarry || !quarryInfo) {
                    return null
                }

                if (prevShare.toString() !== nextShare) {
                    const prevShareParsed: number = prevShare
                    let nextShareParsed: number | null = null
                    
                    try {
                        nextShareParsed = nextShare === '' ? 0 : parseInt(nextShare)
                        // filter out empty changesets
                        if (nextShareParsed === prevShare) {
                            return null
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }

                    return {
                        quarryInfo,
                        quarry,
                        prevShare: prevShare.toString(),
                        nextShare,
                        prevShareParsed,
                        nextShareParsed,
                    }
                }

                return null
            })
            .filter((x): x is ShareDiff => !!x)
    }, [nextSharesRaw, quarries])

    const isDiffValid = useMemo(() => {
        return !sharesDiff.find((diff) => !diff.nextShare)
    }, [sharesDiff])

    const currentTotalShares = gaugeVoter?.account.totalWeight ?? 0
    const nextTotalShares = useMemo(() => {
        return sharesDiff.reduce((acc, diff) => {
            if (diff.nextShareParsed !== null) {
                return acc + diff.nextShareParsed - diff.prevShareParsed
            }
            return acc
        }, currentTotalShares)
    }, [currentTotalShares, sharesDiff])

    const nextShares = useMemo(() => {
        return mapValues(nextSharesRaw, (amt) => {
            try {
                const parsedAmt = parseInt(amt.value)
                return Number.isNaN(parsedAmt) ? null : parsedAmt
            } catch (e) {
                return null
            }
        })
    }, [nextSharesRaw])

    return {
        nextShares,
        nextSharesRaw,
        setTokenShareStr,
        sharesDiff,
        isDiffValid,
        currentTotalShares,
        nextTotalShares,
        escrowKey,
        gaugeKeys: gaugeKeys ?? [],
    }
}

export const {
    useContainer: useUpdateGaugeWeights,
    Provider: UpdateGaugeWeightsProvider,
} = createContainer(useUpdateGaugeWeightsInternal)