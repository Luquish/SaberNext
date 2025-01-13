'use client'

interface FieldWrapperProps {
    label: string
    right?: React.ReactNode
    children?: React.ReactNode
}

/**
 * Wrapper component for form fields with label and optional right content
 */
function FieldWrapper({
    label,
    children,
    right,
}: FieldWrapperProps) {
    return (
        <div className="grid gap-3 grid-flow-row">
            <div className="text-gray-300 text-sm w-full flex justify-between">
                <label>{label}</label>
                <div>{right}</div>
            </div>
            <div>{children}</div>
        </div>
    )
}

export { FieldWrapper }