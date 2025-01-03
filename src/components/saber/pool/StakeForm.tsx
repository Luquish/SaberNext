'use client'

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

import { PoolData } from '@/types/saber'
import { useStake } from '@/hooks/saber/user/useStake'
import useQuarryMiner from '@/hooks/saber/user/useQuarryMiner'
import useUserGetLPTokenBalance from '@/hooks/saber/user/useGetLPTokenBalance'

import H2 from '../ui/typography/H2'
import { Input, InputType } from '../ui/Input'
import { Button } from '../ui/Button'

interface StakeFormProps {
    pool: PoolData
    className?: string
}

interface StakeFormData {
    amount: number
}

export function StakeForm({ pool, className }: StakeFormProps) {
    const { register, watch, setValue } = useForm<StakeFormData>()
    const { stake } = useStake(pool)
    const { refetch: refetchMiner } = useQuarryMiner(pool.info.lpToken, true)
    const { 
        data: balance, 
        refetch: refetchLP, 
    } = useUserGetLPTokenBalance(
        pool.pair.pool.state.poolTokenMint.toString()
    )

    const amount = watch('amount')

    const { 
        mutate: execStake, 
        isPending, 
    } = useMutation({
        mutationKey: ['stake', pool.info.lpToken],
        mutationFn: async (stakeAmount: number) => {
            if (!stakeAmount) return null

            await stake(stakeAmount)
            
            // Refetch balances after staking
            await Promise.all([
                refetchMiner(),
                refetchLP(),
            ])
        },
    })
    
    const handleMaxAmount = () => {
        setValue('amount', balance?.balance.value.uiAmount ?? 0)
    }

    const handleStake = () => {
        if (amount) {
            execStake(amount)
        }
    }

    return (
        <div className={className}>
            <div className="space-y-4">
                <div>
                    <H2>Stake</H2>
                    <p className="text-secondary text-sm">
                        Stake LP tokens to receive farm rewards.
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
                    onClick={handleStake}
                    disabled={!amount || isPending}
                >
                    {isPending ? 'Staking...' : 'Stake'}
                </Button>
            </div>
        </div>
    )
}