import { Token, TokenAmount, TokenInfo } from '@saberhq/token-utils'
import BN from 'bn.js'
import { useEffect, useState } from 'react'

import { createQuarryPayroll } from '@/utils/saber/quarry'
import { SBR_INFO } from '@/utils/saber/builtinTokens'
import useQuarryMiner from './useQuarryMiner'

const SECONDS_PER_DAY = 86400

/**
 * Hook to calculate daily rewards for a given LP token
 */
export default function useDailyRewards(lpToken: TokenInfo) {
    const { data: miner, refetch } = useQuarryMiner(lpToken, true)
    const [dailyRewards, setDailyRewards] = useState(0)

    useEffect(() => {
        if (!miner?.data || !miner.stakedBalance) {
            return
        }

        const now = Math.floor(Date.now() / 1000)
        const payroll = createQuarryPayroll(miner.miner.quarry.quarryData)
        const sbrToken = new Token(SBR_INFO)

        // Calculate rewards at current time
        const rewardsT0 = new TokenAmount(
            sbrToken, 
            payroll.calculateRewardsEarned(
                new BN(now),
                miner.stakedBalance,
                miner.data.rewardsPerTokenPaid,
                miner.data.rewardsEarned
            )
        )

        // Calculate rewards after 24 hours
        const rewardsT1 = new TokenAmount(
            sbrToken,
            payroll.calculateRewardsEarned(
                new BN(now + SECONDS_PER_DAY),
                miner.stakedBalance,
                miner.data.rewardsPerTokenPaid,
                miner.data.rewardsEarned
            )
        )

        // Calculate daily rate
        const dailyRate = ((rewardsT1.asNumber - rewardsT0.asNumber) / SECONDS_PER_DAY) * SECONDS_PER_DAY
        setDailyRewards(dailyRate)
    }, [miner])

    return { dailyRewards, refetch }
}