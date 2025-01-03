'use client'

import { type UseFormRegisterReturn } from 'react-hook-form'
import { Input, InputType } from '@/components/saber/ui/Input'

interface TokenInputProps {
    symbol: string
    balance: number
    isSol: boolean
    onMaxClick: () => void
    register: UseFormRegisterReturn
    className?: string
}

export function TokenInput({
    symbol,
    balance,
    onMaxClick,
    register,
    className,
}: TokenInputProps) {
    return (
        <div className={className}>
            <div className="font-bold text-sm flex items-center gap-2 mt-3">
                <div className="flex-grow">{symbol}</div>
                <span className="text-white text-xs font-normal">
                    Balance:{' '}
                    <button
                        type="button"
                        className="text-saber-light cursor-pointer hover:text-saber-light/80 transition-colors"
                        onClick={onMaxClick}
                    >
                        {balance}
                    </button>
                </span>
            </div>
            
            <Input
                register={register}
                type={InputType.NUMBER}
                placeholder="0.00"
                size="full"
            />
        </div>
    )
}

export default TokenInput