'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'

interface LegendItemProps {
    children: string
}

function LegendItem({ children }: LegendItemProps) {
    const getColorClass = (status: string) => {
        switch (status) {
        case 'Active':
            return 'bg-accent'
        case 'Passed':
            return 'bg-primary'
        case 'Failed':
            return 'bg-warmGray-600'
        default:
            return ''
        }
    }

    return (
        <label className="relative pl-6">
            <span 
                className={`
                    absolute left-0 top-1/2 -translate-y-1/2
                    mr-2.5 w-1 h-3.5 inline-block leading-none
                    ${getColorClass(children)}
                `}
                aria-hidden="true"
            />
            {children}
        </label>
    )
}

/**
 * Component that displays proposal statistics with colored legends
 */
function LegendsNeverDie() {
    const { proposalCount } = useGovernor()

    return (
        <div className="bg-warmGray-800 p-5 flex gap-11 rounded">
            <div className="text-2xl text-white font-medium bg-coolGray-800 rounded-full h-20 w-20 flex items-center justify-center">
                {proposalCount?.toLocaleString()}
            </div>
            <legend className="flex flex-col gap-1 text-sm justify-center font-bold tracking-tight">
                <LegendItem>Active</LegendItem>
                <LegendItem>Passed</LegendItem>
                <LegendItem>Failed</LegendItem>
            </legend>
        </div>
    )
}

export { LegendsNeverDie }