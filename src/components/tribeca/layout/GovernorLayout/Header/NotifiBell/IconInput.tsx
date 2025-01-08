'use client';

import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode
}

export function IconInput({ icon, ...inputProps }: Props) {
    return (
        <div className='relative text-gray-600 focus-within:text-gray-400'>
            <span className='py-2 leading-[1.5rem] text-sm absolute h-full left-0 flex items-center pl-3'>
                {icon}
            </span>
            <input
                className='py-2 text-sm text-white bg-gray-900 rounded-md w-full focus:outline-none focus:bg-white focus:text-gray-900'
                {...inputProps}
            />
        </div>
    )
}
