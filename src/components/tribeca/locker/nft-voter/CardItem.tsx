'use client'

import { MdInfoOutline } from 'react-icons/md'

import { CustomTooltip } from './CustomTooltip'

interface CardItemProps {
    label: string
    children?: React.ReactNode
    tooltip?: string
    stretch?: boolean
}

/**
 * Card item component that displays a label and content with optional tooltip
 */
function CardItem({
    label,
    children,
    tooltip,
    stretch = false,
}: CardItemProps) {
    return (
        <div 
            className={`px-7 py-4 border-b border-warmGray-800 ${
                stretch ? 'flex-1' : ''
            }`}
        >
            <div className="flex flex-row">
                <span className="text-warmGray-400 text-sm">{label}</span>
                {tooltip && (
                    <CustomTooltip content={tooltip}>
                        <MdInfoOutline className="ml-1 w-3.5" />
                    </CustomTooltip>
                )}
            </div>
            <div className="text-xl text-white mt-0.5">{children}</div>
        </div>
    )
}

export { CardItem }