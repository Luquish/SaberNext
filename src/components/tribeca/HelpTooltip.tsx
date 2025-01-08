'use client'

import { MdInfoOutline } from 'react-icons/md'

import { MouseoverTooltip } from './MouseoverTooltip'

interface Props {
    text: React.ReactNode
    children?: React.ReactNode
}

/**
 * Tooltip component with info icon for help text
 */
function HelpTooltip({ text, children }: Props) {
    return (
        <MouseoverTooltip text={text}>
            {children}
            <MdInfoOutline className="inline w-3.5 h-3.5 ml-1.5 hover:text-primary" />
        </MouseoverTooltip>
    )
}

export { HelpTooltip }