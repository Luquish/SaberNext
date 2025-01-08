'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'

interface LegendItemProps {
    children: string
}

function LegendItem({ children }: LegendItemProps) {
    const beforeClasses = `
        before:content-[' ']
        before:mr-2.5 
        before:w-1 
        before:h-3.5 
        before:inline-block 
        before:align-[-25%] 
        before:leading-none
        ${
    children === 'Active' 
        ? 'before:bg-accent' 
        : children === 'Passed'
            ? 'before:bg-primary'
            : 'before:bg-warmGray-600'
}
    `

    return (
        <label className={beforeClasses}>
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