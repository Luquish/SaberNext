'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { FiCheckCircle, FiCopy, FiXCircle } from 'react-icons/fi'

type CopyState = 'copy' | 'copied' | 'errored'

interface CopyableProps {
    text: string
    children: ReactNode
    replaceText?: boolean
}

/**
 * Component that provides copy functionality with visual feedback
 */
function Copyable({ text, children, replaceText }: CopyableProps) {
    const [state, setState] = useState<CopyState>('copy')

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setState('copied')
        } catch (err) {
            setState('errored')
        }
        setTimeout(() => setState('copy'), 1000)
    }

    function CopyIcon() {
        switch (state) {
        case 'copy':
            return (
                <button className="cursor-pointer" onClick={handleClick}>
                    <FiCopy />
                </button>
            )
        case 'copied':
            return (
                <span>
                    <FiCheckCircle />
                </span>
            )
        case 'errored':
            return (
                <span title="Please check your browser's copy permissions.">
                    <FiXCircle />
                </span>
            )
        default:
            return null
        }
    }

    const message = state === 'copied' ? 'Copied' : state === 'errored' ? 'Copy Failed' : undefined

    function PrependCopyIcon() {
        return (
            <>
                <span className="text-xs m-2">
                    <span className="flex items-center gap-1">
                        {message && <span>{message}</span>}
                        <CopyIcon />
                    </span>
                </span>
                {children}
            </>
        )
    }

    function ReplaceWithMessage() {
        return (
            <span className="flex flex-col flex-nowrap">
                <span className="text-xs">
                    <span className="flex items-center text-primary">
                        <CopyIcon />
                        <span className="mx-2">{message}</span>
                    </span>
                </span>
                <span className="hidden">{children}</span>
            </span>
        )
    }

    if (state === 'copy') {
        return <PrependCopyIcon />
    }

    if (replaceText) {
        return <ReplaceWithMessage />
    }

    return (
        <>
            <span className="hidden lg:inline">
                <PrependCopyIcon />
            </span>
            <span className="inline lg:hidden">
                <ReplaceWithMessage />
            </span>
        </>
    )
}

export type { CopyableProps }
export { Copyable }