'use client'

import { extractErrorMessage } from '@rockooor/sail'

interface Props {
    prefix?: string
    error: unknown
}

/**
 * Component to display error messages with optional prefix
 */
function ErrorMessage({ prefix, error }: Props) {
    const message = extractErrorMessage(error)
    
    return (
        <div className="text-red-500 text-sm px-3 py-2 border-accent-200">
            <span>
                {prefix ? `${prefix}: ` : ''}
                {message ?? 'Unknown error'}
            </span>
        </div>
    )
}

export { ErrorMessage }