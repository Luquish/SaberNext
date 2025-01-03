import { ReactNode } from 'react'

interface H2Props {
    children: ReactNode
    className?: string
}

export function H2({ 
    children, 
    className = '', 
}: H2Props) {
    return (
        <h2 
            className={`
                text-xl text-slate-200 font-bold mb-3
                ${className}
            `}
        >
            {children}
        </h2>
    )
}

export default H2