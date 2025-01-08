'use client'

import { Switch } from '@headlessui/react'
import { useState } from 'react'

import { LoadingSpinner } from './LoadingSpinner'

interface Props {
    label?: string
    checked: boolean
    onChange: (value: boolean) => void | Promise<void>
}

/**
 * Toggle switch component with loading state
 */
function Toggle({
    label,
    checked,
    onChange,
}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pendingChecked, setPendingChecked] = useState<boolean>(checked)

    const displayChecked = isLoading ? pendingChecked : checked

    return (
        <Switch.Group>
            <div className="flex items-center text-sm">
                <Switch
                    checked={displayChecked}
                    disabled={isLoading}
                    onChange={async (value: boolean) => {
                        setPendingChecked(value)
                        setIsLoading(true)
                        try {
                            await onChange(value)
                        } catch (e) {
                            console.error(e)
                        }
                        setIsLoading(false)
                    }}
                    className={`
                        relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                        ${displayChecked ? 'bg-primary' : 'bg-warmGray-600'}
                        ${isLoading ? 'bg-warmGray-400' : ''}
                    `}
                >
                    <span
                        className={`
                            inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                            ${displayChecked ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                </Switch>
                {isLoading && <LoadingSpinner className="ml-2 text-warmGray-400" />}
                {label && (
                    <Switch.Label className="ml-2 font-medium text-warmGray-400">
                        {label}
                    </Switch.Label>
                )}
            </div>
        </Switch.Group>
    )
}

export { Toggle }