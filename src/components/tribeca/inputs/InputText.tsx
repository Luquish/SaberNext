'use client'

import { forwardRef } from 'react'

const commonClasses = `
    py-1.5 px-3 border border-gray-200 rounded m-0 
    transition-colors appearance-none text-sm outline-none
    focus:ring-1 focus:ring-primary-300
    dark:bg-gray-850 dark:border-gray-700 dark:focus:bg-transparent dark:text-white
`

export const InputText = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function InputText(props, ref) {
        return (
            <input
                ref={ref}
                {...props}
                className={`h-8 ${commonClasses} ${props.className ?? ''}`}
            />
        )
    }
)

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    function Textarea(props, ref) {
        return (
            <textarea
                ref={ref}
                {...props}
                className={`h-8 ${commonClasses} ${props.className ?? ''}`}
            />
        )
    }
)

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    function Select(props, ref) {
        return (
            <select
                ref={ref}
                {...props}
                className={`${commonClasses} ${props.className ?? ''}`}
            >
                {props.children}
            </select>
        )
    }
)

export const Radio = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Radio(props, ref) {
        return (
            <input
                ref={ref}
                type="radio"
                {...props}
                className={props.className}
            />
        )
    }
)