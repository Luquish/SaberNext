'use client'

interface Props {
    className?: string
    icon?: React.ReactNode
    title?: string
    children?: React.ReactNode
}

/**
 * Notice component with optional icon and title
 */
function Notice({
    className,
    icon,
    title,
    children,
}: Props) {
    return (
        <div className={`border px-5 py-4 flex flex-col gap-3 ${className || ''}`}>
            {title && (
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="text-secondary [&>img]:w-[18px] [&>img]:h-[18px] [&>svg]:w-[18px] [&>svg]:h-[18px]">
                            {icon}
                        </div>
                    )}
                    <h2 className="font-medium text-sm">{title}</h2>
                </div>
            )}
            <div className="prose prose-sm">
                {children}
            </div>
        </div>
    )
}

export { Notice }