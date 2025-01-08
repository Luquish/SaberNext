'use client'

import type { FieldHookConfig } from 'formik'
import { useField } from 'formik'

import { InputText } from './InputText'
import type { LabeledInputProps } from './LabeledInput'
import { LabeledInput } from './LabeledInput'

type TextFieldProps = FieldHookConfig<string> & 
    Omit<LabeledInputProps<HTMLInputElement>, 'Component'>

/**
 * Text field component that integrates Formik with LabeledInput
 */
function TextField(props: TextFieldProps) {
    const [field, meta] = useField<string>(props)
    
    return (
        <LabeledInput
            Component={InputText}
            type="text"
            touched={meta.touched}
            error={meta.error}
            {...field}
            {...props}
        />
    )
}

export type { TextFieldProps }
export { TextField }