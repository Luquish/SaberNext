'use client'

import { ChangeEvent } from 'react'
import { FaSearch } from 'react-icons/fa'

interface InputSearchTextProps {
    value: string
    onChange: (evt: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
}

/**
 * Search input component with search icon and custom styling
 */
function InputSearchText({
    value,
    onChange,
    placeholder,
}: InputSearchTextProps) {
    return (
        <div
            className={`
                flex py-1.5 px-3 border border-gray-200 rounded m-0 
                transition-colors appearance-none
                dark:bg-gray-850 dark:border-gray-700
                focus-within:ring-primary-300 focus-within:ring-1 focus-within:bg-transparent
            `}
        >
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-transparent outline-none text-sm"
            />
            <FaSearch className="w-3.5 h-3.5 my-auto text-secondary" />
        </div>
    )
}

export type { InputSearchTextProps }
export { InputSearchText }