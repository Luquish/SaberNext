'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Token, TokenAmount, WRAPPED_SOL } from '@saberhq/token-utils'

import { PoolData } from '@/types/saber'
import { getSymbol } from '@/utils/saber/pool'
import { getMax } from '@/utils/saber/token'

import { useUserATA } from '@/hooks/saber/user/useUserATA'
import { useDeposit } from '@/hooks/saber/user/useDeposit'
import useQuarryMiner from '@/hooks/saber/user/useQuarryMiner'
import useUserGetLPTokenBalance from '@/hooks/saber/user/useGetLPTokenBalance'
import { useStableSwapTokens } from '@/hooks/saber/useStableSwapTokens'
import useNetwork from '@/hooks/saber/useNetwork'

import H2 from '../ui/typography/H2'
import { Button } from '../ui/Button'
import { TokenInput } from '../ui/TokenInput'
import { DepositStats } from '../ui/DepositStats'

const SLIPPAGE_THRESHOLD = 0.01

interface DepositFormProps {
    pool: PoolData
    className?: string
}

interface DepositFormData {
    amountTokenA: number
    amountTokenB: number
    noStake: boolean
}

export function DepositForm({ pool, className }: DepositFormProps) {
    const { network } = useNetwork()
    const { register, watch, setValue } = useForm<DepositFormData>()
    const ssTokens = useStableSwapTokens(pool)

    // Token setup
    const token0 = useMemo(() => (
        ssTokens?.underlyingTokens?.[0] || pool.info.tokens[0]
    ), [pool, ssTokens])

    const token1 = useMemo(() => (
        ssTokens?.underlyingTokens?.[1] || pool.info.tokens[1]
    ), [pool, ssTokens])

    // Balances and refetch handlers
    const { data: ataInfo0, refetch: refetchBalances0 } = useUserATA(new Token(token0))
    const { data: ataInfo1, refetch: refetchBalances1 } = useUserATA(new Token(token1))
    const { refetch: refetchMiner } = useQuarryMiner(pool.info.lpToken, true)
    const { refetch: refetchLP } = useUserGetLPTokenBalance(
        pool.pair.pool.state.poolTokenMint.toString()
    )

    // Form values
    const { amountTokenA, amountTokenB, noStake } = watch()

    // Calculations
    const usdValue = useMemo(() => (
        (amountTokenA * pool.usdPrice.tokenA) + (amountTokenB * pool.usdPrice.tokenB)
    ), [amountTokenA, amountTokenB, pool.usdPrice])

    const tokenAmounts = useMemo(() => ([
        TokenAmount.parse(new Token(token0), amountTokenA?.toString() || '0'),
        TokenAmount.parse(new Token(token1), amountTokenB?.toString() || '0'),
    ]), [amountTokenA, amountTokenB, token0, token1])

    // Deposit setup
    const deposit = useDeposit({ tokenAmounts, pool })
    const slippage = deposit.estimatedDepositSlippage?.asNumber ?? 0
    const priceImpact = deposit.priceImpact?.asNumber ?? 0

    // Deposit mutation
    const { mutate: execDeposit, isPending } = useMutation({
        mutationKey: ['deposit'],
        mutationFn: async () => {
            if (!amountTokenA && !amountTokenB) return
            
            await deposit?.handleDeposit(noStake)
            
            // Refetch all relevant data
            await Promise.all([
                refetchMiner(),
                refetchLP(),
                refetchBalances0(),
                refetchBalances1(),
            ])
        },
    })

    const handleSetMaxAmount = (token: 'A' | 'B', ataInfo: typeof ataInfo0) => {
        const maxAmount = getMax(
            ataInfo?.balance.asNumber ?? 0, 
            ataInfo?.mint === WRAPPED_SOL[network].address
        )
        setValue(`amountToken${token}`, maxAmount)
    }

    const isDepositDisabled = (!amountTokenA && !amountTokenB) || 
                             Math.abs(slippage) > SLIPPAGE_THRESHOLD

    return (
        <div className={className}>
            <div className="space-y-4">
                <div>
                    <H2>Deposit</H2>
                    <p className="text-secondary text-sm">
                        Deposit and stake tokens to earn yield.
                    </p>
                </div>

                <TokenInput 
                    symbol={getSymbol(token0.symbol)}
                    balance={ataInfo0?.balance.asNumber ?? 0}
                    isSol={ataInfo0?.mint === WRAPPED_SOL[network].address}
                    onMaxClick={() => handleSetMaxAmount('A', ataInfo0)}
                    register={register('amountTokenA')}
                />

                <TokenInput 
                    symbol={getSymbol(token1.symbol)}
                    balance={ataInfo1?.balance.asNumber ?? 0}
                    isSol={ataInfo1?.mint === WRAPPED_SOL[network].address}
                    onMaxClick={() => handleSetMaxAmount('B', ataInfo1)}
                    register={register('amountTokenB')}
                />

                <Button
                    size="full"
                    onClick={() => execDeposit()}
                    disabled={isDepositDisabled}
                >
                    {isPending ? 'Depositing...' : 
                        Math.abs(slippage) > SLIPPAGE_THRESHOLD ? 'Slippage too high' : 
                            'Deposit'}
                </Button>

                {usdValue > 0 && (
                    <DepositStats 
                        usdValue={usdValue}
                        estimatedMint={deposit.estimatedMint?.mintAmount.asNumber}
                        slippage={slippage}
                        priceImpact={priceImpact}
                    />
                )}
            </div>
        </div>
    )
}
