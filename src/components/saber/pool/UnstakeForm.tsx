'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Token, TokenAmount } from '@saberhq/token-utils'
import BigNumber from 'bignumber.js'

import { PoolData } from '@/types/saber'
import { toPrecision } from '@/utils/saber/number'
import { calculateWithdrawAll } from '@/hooks/saber/user/useWithdraw/calculateWithdrawAll'

import useQuarryMiner from '@/hooks/saber/user/useQuarryMiner'
import { useWithdraw } from '@/hooks/saber/user/useWithdraw'
import { useStableSwapTokens } from '@/hooks/saber/useStableSwapTokens'
import useSettings from '@/hooks/saber/useSettings'
import useUserGetLPTokenBalance from '@/hooks/saber/user/useGetLPTokenBalance'

import H2 from '../ui/typography/H2'
import { Input, InputType } from '../ui/Input'
import { Button } from '../ui/Button'

interface UnstakeFormProps {
    pool: PoolData
    className?: string
}

interface UnstakeFormData {
    amount: number
    noWithdraw: boolean
}

export function UnstakeForm({ pool, className }: UnstakeFormProps) {
    const { register, watch, setValue } = useForm<UnstakeFormData>()
    const { data: miner, refetch: refetchMiner } = useQuarryMiner(pool.info.lpToken, true)
    const { refetch: refetchLP } = useUserGetLPTokenBalance(
        pool.pair.pool.state.poolTokenMint.toString()
    )
    const tokens = useStableSwapTokens(pool)
    const { maxSlippagePercent } = useSettings()

    const amount = watch('amount')

    // Calculate staked balance
    const stakedBalance = useMemo(() => {
        if (!miner?.stakedBalance) return 0

        return new BigNumber(miner.stakedBalance.toString())
            .div(new BigNumber(10 ** miner.miner.quarry.token.decimals))
            .toNumber()
    }, [miner])

    // Setup withdraw hook
    const withdraw = useWithdraw({
        withdrawPoolTokenAmount: TokenAmount.parse(
            new Token(pool.info.lpToken), 
            amount?.toString() || '0'
        ),
        withdrawToken: undefined, // Always do balanced withdraw
        wrappedTokens: tokens?.wrappedTokens,
        pool,
        actions: {
            withdraw: false,
            unstake: true,
        },
    })

    // Calculate USD value
    const stakedUsdValue = useMemo(() => {
        if (!miner?.data || !amount) return 0

        const values = calculateWithdrawAll({
            poolTokenAmount: TokenAmount.parse(
                new Token(pool.info.lpToken), 
                amount.toString()
            ),
            maxSlippagePercent,
            exchangeInfo: pool.exchangeInfo,
        })

        const valueA = values.estimates[0]?.asNumber ?? 0
        const valueB = values.estimates[1]?.asNumber ?? 0
        
        return (valueA * pool.usdPrice.tokenA) + 
               (valueB * pool.usdPrice.tokenB)
    }, [miner, amount, pool, maxSlippagePercent])

    // Unstake mutation
    const { mutate: execUnstake, isPending } = useMutation({
        mutationKey: ['unstake', pool.info.lpToken],
        mutationFn: async () => {
            if (!amount) return

            await withdraw?.handleWithdraw()
            
            // Refetch balances after unstaking
            await Promise.all([
                refetchMiner(),
                refetchLP(),
            ])
        },
    })

    const handleMaxAmount = () => setValue('amount', stakedBalance)
    const handleUnstake = () => amount && execUnstake()

    return (
        <div className={className}>
            <div className="space-y-4">
                <div>
                    <H2>Unstake</H2>
                    <p className="text-secondary text-sm">
                        Unstake your staked liquidity.
                    </p>
                </div>

                <div>
                    <Input 
                        align="right"
                        type={InputType.NUMBER}
                        placeholder="0.00"
                        size="full"
                        register={register('amount')}
                    />
                    
                    <div className="text-white text-xs text-right mt-2">
                        Balance:{' '}
                        <button
                            type="button"
                            className="text-saber-light hover:text-saber-light/80 transition-colors"
                            onClick={handleMaxAmount}
                        >
                            {stakedBalance}
                        </button>
                    </div>
                </div>

                <Button 
                    size="full"
                    onClick={handleUnstake}
                    disabled={!amount || isPending}
                >
                    {isPending ? 'Unstaking...' : 'Unstake'}
                </Button>

                <div className="text-right text-gray-400 text-xs">
                    ${amount > 0 ? toPrecision(stakedUsdValue, 4) : '—'}
                </div>
            </div>
        </div>
    )
}