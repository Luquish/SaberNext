import clsx from 'clsx'
import { toPrecision } from '@/utils/saber/number'

const SLIPPAGE_WARNING = 0.1
const PRICE_IMPACT_WARNING = 0.1

interface DepositStatsProps {
    usdValue: number
    estimatedMint?: number
    slippage: number
    priceImpact: number
    className?: string
}

interface StatRowProps {
    label: string
    value: string
    isWarning?: boolean
}

function StatRow({ 
    label, 
    value, 
    isWarning, 
}: StatRowProps) {
    return (
        <>
            <div>{label}</div>
            <div className={clsx(
                'text-right',
                isWarning && 'text-red-600 font-bold'
            )}>
                {value}
            </div>
        </>
    )
}

export function DepositStats({
    usdValue,
    estimatedMint,
    slippage,
    priceImpact,
    className,
}: DepositStatsProps) {
    return (
        <div className={clsx(
            'text-gray-400 text-xs grid grid-cols-2 w-full mt-2 gap-1',
            className
        )}>
            <StatRow 
                label="Estimated USD value"
                value={`$${toPrecision(usdValue, 4)}`}
            />

            <StatRow 
                label="LP tokens received"
                value={estimatedMint ? toPrecision(estimatedMint, 4) : '-'}
            />

            <StatRow 
                label="Slippage"
                value={`${toPrecision(Math.abs(slippage) * 100, 4)}%`}
                isWarning={Math.abs(slippage) > SLIPPAGE_WARNING}
            />

            <StatRow 
                label="Price impact"
                value={`${toPrecision(Math.abs(priceImpact) * 100, 4)}%`}
                isWarning={Math.abs(priceImpact) > PRICE_IMPACT_WARNING}
            />
        </div>
    )
}