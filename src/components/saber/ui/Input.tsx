'use client'

import { type UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'

export enum InputType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    DROPDOWN = 'DROPDOWN',
    CHECKBOX = 'CHECKBOX'
}

interface BaseInputProps {
    register?: UseFormRegisterReturn
    size?: 'full'
    className?: string
}

type InputTypes = BaseInputProps & (
    | {
        type?: InputType.TEXT
        placeholder?: string
        defaultValue?: string
    }
    | {
        type: InputType.NUMBER
        placeholder?: string
        align?: 'right'
    }
    | {
        type: InputType.DROPDOWN
        placeholder?: string
        values: [string, string][]
    }
    | {
        type: InputType.CHECKBOX
        label: string
    }
)

function TextInput({ 
    register, 
    size, 
    placeholder, 
    defaultValue,
    className, 
}: BaseInputProps & { 
    placeholder?: string
    defaultValue?: string 
}) {
    return (
        <input
            {...register}
            type="text"
            placeholder={placeholder}
            defaultValue={defaultValue}
            className={clsx(
                'bg-slate-800 relative z-10',
                'text-slate-200 text-sm',
                'rounded-lg py-2 px-3',
                'focus:outline-none transition-colors',
                'placeholder:italic placeholder:text-slate-400',
                size === 'full' && 'w-full',
                className
            )}
        />
    )
}

function NumberInput({ 
    register, 
    size, 
    placeholder, 
    align,
    className, 
}: BaseInputProps & { 
    placeholder?: string
    align?: 'right' 
}) {
    return (
        <input
            {...register}
            type="number"
            placeholder={placeholder}
            className={clsx(
                'relative z-10 bg-transparent',
                'text-xl text-slate-200 font-mono',
                'focus:outline-none',
                'placeholder:text-slate-600',
                size === 'full' && 'w-full',
                align === 'right' && 'text-right',
                className
            )}
        />
    )
}

function CheckboxInput({ 
    register, 
    size, 
    label,
    className, 
}: BaseInputProps & { 
    label: string 
}) {
    return (
        <label className={clsx(
            'flex items-center gap-1',
            size === 'full' && 'w-full',
            className
        )}>
            <input
                {...register}
                type="checkbox"
                className="relative z-10 bg-transparent"
            />
            {label}
        </label>
    )
}

function DropdownInput({ 
    register, 
    placeholder, 
    values,
    className, 
}: BaseInputProps & { 
    placeholder?: string
    values: [string, string][]
}) {
    return (
        <select
            {...register}
            className={clsx(
                'bg-slate-800 relative z-10',
                'text-slate-200 text-sm',
                'rounded-lg py-2 px-3',
                'cursor-pointer',
                'focus:outline-none transition-colors',
                className
            )}
        >
            {placeholder && (
                <option value="" disabled>{placeholder}</option>
            )}
            {values.map(([value, label]) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    )
}

export function Input(props: InputTypes) {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <div className={clsx('flex', props.size === 'full' && 'w-full')}>
            <div className={clsx('group relative', props.size === 'full' && 'w-full')}>
                {children}
            </div>
        </div>
    )

    if (!props.type || props.type === InputType.TEXT) {
        return (
            <Wrapper>
                <TextInput {...props} />
            </Wrapper>
        )
    }

    if (props.type === InputType.NUMBER) {
        return (
            <Wrapper>
                <NumberInput {...props} />
            </Wrapper>
        )
    }

    if (props.type === InputType.CHECKBOX) {
        return (
            <Wrapper>
                <div className="bg-slate-800 relative z-10 text-slate-200 rounded-lg py-2 px-3">
                    <CheckboxInput {...props} />
                </div>
            </Wrapper>
        )
    }

    if (props.type === InputType.DROPDOWN) {
        return (
            <Wrapper>
                <DropdownInput {...props} />
            </Wrapper>
        )
    }
}