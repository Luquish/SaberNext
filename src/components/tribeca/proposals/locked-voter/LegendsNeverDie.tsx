'use client'

import { useGovernor } from '@/hooks/tribeca/useGovernor'

interface LegendItemProps {
    children: string
}

function LegendItem({ children }: LegendItemProps) {
    const getColorAndGlow = (status: string) => {
        switch (status) {
        case 'Active':
            return 'bg-accent shadow-[0_0_10px_var(--accent)]'
        case 'Passed':
            return 'bg-saber shadow-[0_0_10px_var(--saber)]'
        case 'Failed':
            return 'bg-warmGray-600 shadow-[0_0_10px_var(--warmGray-600)]'
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
                    ${getColorAndGlow(children)}
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
        <div className="border-[#595959] border-2 p-3 flex gap-11 rounded">
            <div 
                className="text-2xl text-white font-medium rounded-full h-20 w-20 flex items-center justify-center relative overflow-hidden"
                style={{
                    background: `radial-gradient(circle at center,
                        var(--accent) 0%,
                        var(--saber) 50%,
                        var(--warmGray-600) 100%
                    )`,
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
                }}
            >
                <div className="z-10">{proposalCount?.toLocaleString()}</div>
                <div 
                    className="absolute inset-0 bg-coolGray-800/80"
                    style={{ mixBlendMode: 'multiply' }}
                />
            </div>
            <legend className="flex flex-col gap-1 text-sm justify-center font-regular tracking-tight">
                <LegendItem>Active</LegendItem>
                <LegendItem>Passed</LegendItem>
                <LegendItem>Failed</LegendItem>
            </legend>
        </div>
    )
}

export { LegendsNeverDie }