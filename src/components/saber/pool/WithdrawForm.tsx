'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Token, TokenAmount } from '@saberhq/token-utils'

import { PoolData } from '@/types/saber'
import { useWithdraw } from '@/hooks/saber/user/useWithdraw'
import { useStableSwapTokens } from '@/hooks/saber/useStableSwapTokens'
import useQuarryMiner from '@/hooks/saber/user/useQuarryMiner'
import useUserGetLPTokenBalance from '@/hooks/saber/user/useGetLPTokenBalance'

import H2 from '../ui/typography/H2'
import { Input, InputType } from '../ui/Input'
import { Button } from '../ui/Button'

interface WithdrawFormProps {
    pool: PoolData
    className?: string
}

interface WithdrawFormData {
    amount: number
}

export function WithdrawForm({ pool, className }: WithdrawFormProps) {
    const { register, watch, setValue } = useForm<WithdrawFormData>()
    const { refetch: refetchMiner } = useQuarryMiner(pool.info.lpToken, true)
    const { 
        data: balance, 
        refetch: refetchLP,
    } = useUserGetLPTokenBalance(
        pool.pair.pool.state.poolTokenMint.toString()
    )
    const tokens = useStableSwapTokens(pool)

    const amount = watch('amount')

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
            withdraw: true,
            unstake: false,
        },
    })

    // Withdraw mutation
    const { mutate: execWithdraw, isPending } = useMutation({
        mutationKey: ['withdraw', pool.info.lpToken],
        mutationFn: async () => {
            if (!amount) return

            await withdraw?.handleWithdraw()
            
            // Refetch balances after withdrawal
            await Promise.all([
                refetchMiner(),
                refetchLP(),
            ])
        },
    })

    const handleMaxAmount = () => {
        setValue('amount', balance?.balance.value.uiAmount ?? 0)
    }

    const handleWithdraw = () => {
        if (amount) {
            execWithdraw()
        }
    }

    return (
        <div className={className}>
            <div className="space-y-4">
                <div>
                    <H2>Withdraw</H2>
                    <p className="text-secondary text-sm">
                        Withdraw LP tokens to receive the underlying tokens.
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
                            {balance?.balance.value.uiAmount ?? 0}
                        </button>
                    </div>
                </div>

                <Button 
                    size="full"
                    onClick={handleWithdraw}
                    disabled={!amount || isPending}
                >
                    {isPending ? 'Withdrawing...' : 'Withdraw'}
                </Button>
            </div>
        </div>
    )
}