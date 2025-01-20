'use client'

import { FaCheck, FaTimes } from 'react-icons/fa'

import { Alert } from '@/components/tribeca/Alert'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { ProseSmall } from '@/components/tribeca/typography/Prose'

interface ChecklistItemProps {
    title: string
    description?: string
    pass?: boolean
    children?: React.ReactNode
}

/**
 * Component for displaying a checklist item with pass/fail status
 */
function ChecklistItem({
    title,
    description,
    pass,
    children,
}: ChecklistItemProps) {
    return (
        <div className="px-7 py-4">
            <div className="flex flex-row justify-between">
                <div>
                    <span className="text-white font-semibold">{title}</span>
                    <span className="text-warmGray-600 font-normal text-xs">
                        {description}
                    </span>
                </div>
                <div>
                    {pass ? (
                        <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center">
                            <FaCheck className="h-3 w-3" />
                        </div>
                    ) : pass === undefined ? (
                        <LoadingSpinner className="h-6 w-6" />
                    ) : (
                        <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                            <FaTimes className="h-3 w-3" />
                        </div>
                    )}
                </div>
            </div>
            {pass === false && (
                <Alert className="mt-4 text-white">
                    <ProseSmall>{children}</ProseSmall>
                </Alert>
            )}
        </div>
    )
}

export { ChecklistItem }