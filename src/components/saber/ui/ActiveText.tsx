import { ReactNode } from 'react'

interface ActiveTextProps {
    children: ReactNode
    className?: string
    onClick?: () => void
}

export function ActiveText({ 
    children, 
    className = '',
    onClick, 
}: ActiveTextProps) {
    return (
        <div className="flex">
            <div 
                className="group relative"
                onClick={onClick}
                role={onClick ? 'button' : undefined}
            >
                <div className={`
                    text-slate-200 bg-slate-800
                    relative z-10 px-3
                    rounded-lg
                    flex gap-1 items-center justify-center
                    cursor-pointer
                    transition-colors
                    hover:bg-slate-700
                    ${className}
                `}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ActiveText