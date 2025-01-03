import { Token, TokenAmount, TokenInfo } from '@saberhq/token-utils'
import BN from 'bn.js'
import { useMemo, useState } from 'react'

import { createQuarryPayroll } from '@/utils/saber/quarry'
import { SBR_INFO } from '@/utils/saber/builtinTokens'
import useQuarryMiner from './useQuarryMiner'
import useGetSecondaryPayrolls from './useGetSecondaryPayrolls'

interface RewardsState {
    primary: number
    secondary: number[]
}

/**
 * Hook to calculate claimable rewards for a given LP token
 */
export default function useClaimableRewards(lpToken: TokenInfo) {
    const { data: miner } = useQuarryMiner(lpToken, true)
    const { data: secondaryPayrolls } = useGetSecondaryPayrolls(lpToken)
    const [rewardsT0, setRewardsT0] = useState<RewardsState>({ 
        primary: 0, 
        secondary: [], 
    })
    const [timeT0, setTimeT0] = useState(0)

    /**
     * Calculates current claimable rewards with millisecond precision
     */
    const claimableRewards = useMemo(() => () => {
        if (!miner?.data || !miner.stakedBalance || !secondaryPayrolls) {
            return null
        }

        const time = Date.now()
        const timeInSec = Math.floor(time / 1000)
        const payroll = createQuarryPayroll(miner.miner.quarry.quarryData)
        const sbrToken = new Token(SBR_INFO)

        // Calculate primary rewards
        const rewards = calculatePrimaryRewards(
            payroll,
            timeInSec,
            miner,
            sbrToken,
            secondaryPayrolls
        )

        // Calculate secondary rewards
        const secondaryRewards = calculateSecondaryRewards(
            secondaryPayrolls,
            timeInSec,
        )

        const reward = { 
            primary: rewards.asNumber, 
            secondary: secondaryRewards,
        }

        // Handle initial state
        if (!rewardsT0.primary) {
            setRewardsT0(reward)
            setTimeT0(timeInSec)
            return reward
        }

        // Calculate millisecond precision rewards
        return calculatePreciseRewards(
            time,
            timeInSec,
            timeT0,
            reward,
            rewardsT0,
            secondaryRewards
        )
    }, [
        miner,
        secondaryPayrolls,
        timeT0,
        rewardsT0,
    ])

    const reset = () => {
        setRewardsT0({ primary: 0, secondary: [] })
        setTimeT0(0)
    }

    return { claimableRewards, reset }
}

/**
 * Calculates primary rewards including merge miner rewards if applicable
 */
function calculatePrimaryRewards(
    payroll: any,
    timeInSec: number,
    miner: any,
    sbrToken: Token,
    secondaryPayrolls: any[]
): TokenAmount {
    let rewards = new TokenAmount(
        sbrToken,
        payroll.calculateRewardsEarned(
            new BN(timeInSec),
            miner.stakedBalanceLegacy,
            miner.data.rewardsPerTokenPaid,
            miner.data.rewardsEarned
        )
    )

    if (miner.mergeMinerData && secondaryPayrolls.length === 0) {
        rewards = rewards.add(
            new TokenAmount(
                sbrToken,
                payroll.calculateRewardsEarned(
                    new BN(timeInSec),
                    miner.stakedBalanceMM,
                    miner.mergeMinerData.rewardsPerTokenPaid,
                    miner.mergeMinerData.rewardsEarned
                )
            )
        )
    }

    return rewards
}

/**
 * Calculates secondary rewards for all secondary payrolls
 */
function calculateSecondaryRewards(
    secondaryPayrolls: any[],
    timeInSec: number,
): number[] {
    return secondaryPayrolls.map(secondaryPayroll => {
        if (!secondaryPayroll) return 0

        // Calculate secondary rewards
        return new TokenAmount(
            secondaryPayroll.rewardsToken,
            secondaryPayroll.payroll.calculateRewardsEarned(
                new BN(timeInSec),
                secondaryPayroll.replicaMinerData.balance,
                secondaryPayroll.replicaMinerData.rewardsPerTokenPaid,
                secondaryPayroll.replicaMinerData.rewardsEarned
            )
        ).asNumber
    })
}

/**
 * Calculates precise rewards including millisecond precision
 */
function calculatePreciseRewards(
    time: number,
    timeInSec: number,
    timeT0: number,
    reward: RewardsState,
    rewardsT0: RewardsState,
    secondaryRewards: number[]
): RewardsState {
    const extraMs = time - timeInSec * 1000
    const timeDiff = timeInSec - timeT0

    // Calculate reward rates per millisecond
    const primaryRewardRate = timeDiff > 0 
        ? ((reward.primary - rewardsT0.primary) / timeDiff) / 1000 
        : 0

    const secondaryRewardRates = secondaryRewards.map((secondaryReward, i) => 
        timeDiff > 0 
            ? ((secondaryReward - rewardsT0.secondary[i]) / timeDiff) / 1000 
            : 0
    )

    return {
        primary: reward.primary + primaryRewardRate * extraMs,
        secondary: secondaryRewards.map((secondaryReward, i) => 
            secondaryReward + secondaryRewardRates[i] * extraMs
        ),
    }
}