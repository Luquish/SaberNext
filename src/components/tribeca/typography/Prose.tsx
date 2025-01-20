'use client'

export function Prose({ className, ...props }: React.HTMLProps<HTMLDivElement>) {
    return (
        <div 
            className={`
                text-sm sm:text-base leading-relaxed
                [&>p]:mb-4 [&>p:last-child]:mb-0
                [&>a]:text-saber [&>a]:hover:underline
                [&>code]:hyphens-auto
                [&>ol]:list-decimal [&>ol]:pl-4
                [&>ul]:list-disc [&>ul]:pl-4
                [&>h1,&>h2,&>h3]:text-white [&>h1,&>h2,&>h3]:font-semibold
                [&>h1]:text-xl
                [&>h2]:text-lg
                [&>h3]:text-base [&>h3]:sm:text-lg
                ${className || ''}
            `}
            {...props}
        />
    )
}

export function ProseSmall(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <Prose 
            {...props} 
            className={`text-sm sm:text-sm ${props.className || ''}`}
        />
    )
}