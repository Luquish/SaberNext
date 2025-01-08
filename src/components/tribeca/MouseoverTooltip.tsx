'use client'

import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import type { PopoverProps } from './Popover'
import { Popover } from './Popover'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
    text: ReactNode
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
    content: ReactNode
}

/**
 * Base tooltip container
 */
function TooltipContainer({ children }: { children: ReactNode }) {
    return (
        <div className="py-2 px-4 text-sm text-white">
            {children}
        </div>
    )
}

/**
 * Basic tooltip component
 */
function Tooltip({ text, ...rest }: TooltipProps) {
    return (
        <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
    )
}

/**
 * Tooltip with custom content
 */
function TooltipContent({ content, ...rest }: TooltipContentProps) {
    return (
        <Popover
            content={<TooltipContainer>{content}</TooltipContainer>}
            {...rest}
        />
    )
}

/**
 * Tooltip that shows on mouseover
 */
function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [])
    const close = useCallback(() => setShow(false), [])

    return (
        <Tooltip {...rest} show={show}>
            <div onMouseEnter={open} onMouseLeave={close}>
                {children}
            </div>
        </Tooltip>
    )
}

/**
 * Tooltip with custom content that shows on mouseover
 */
function MouseoverTooltipContent({
    content,
    children,
    ...rest
}: Omit<TooltipContentProps, 'show'>) {
    const [show, setShow] = useState(false)
    const open = useCallback(() => setShow(true), [])
    const close = useCallback(() => setShow(false), [])

    return (
        <TooltipContent {...rest} show={show} content={content}>
            <div 
                className="inline-block p-1" 
                onMouseEnter={open} 
                onMouseLeave={close}
            >
                {children}
            </div>
        </TooltipContent>
    )
}

export { 
    Tooltip, 
    TooltipContent, 
    MouseoverTooltip, 
    MouseoverTooltipContent,
}