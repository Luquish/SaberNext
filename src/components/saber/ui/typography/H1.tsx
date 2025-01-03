import { ReactNode } from 'react'

interface H1Props {
    children: ReactNode
    className?: string
}

export function H1({ 
    children, 
    className = '', 
}: H1Props) {
    return (
        <h1 
            className={`
                text-2xl text-slate-200 font-bold mb-5
                ${className}
            `}
        >
            {children}
        </h1>
    )
}

export default H1