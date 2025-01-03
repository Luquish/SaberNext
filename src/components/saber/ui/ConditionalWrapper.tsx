import { type ReactNode, type ReactElement } from 'react'

interface ConditionalWrapperProps {
    condition: boolean
    wrapper: (children: ReactNode) => ReactElement
    children: ReactNode
}

export function ConditionalWrapper({ 
    condition, 
    wrapper, 
    children, 
}: ConditionalWrapperProps) {
    return condition ? wrapper(children) : children
}
