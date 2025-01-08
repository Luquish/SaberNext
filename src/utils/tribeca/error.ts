import { extractErrorMessage } from '@rockooor/sail'
import * as Sentry from '@sentry/react'
import type { CaptureContext, Extras } from '@sentry/types'

import { notify } from './notifications'

/**
 * Custom error class that captures additional context
 */
export class CapturedError extends Error {
    constructor(
        override readonly name: string,
        override readonly message: string,
        readonly source: string,
        readonly originalError: unknown
    ) {
        super(message)
    }
}

/**
 * Parses and formats RPC error messages
 */
export const describeRPCError = (msg: string): string => {
    try {
        const result = JSON.parse(msg.substring('503 : '.length)) as {
            error: {
                code: string
                message: string
            }
        }
        return `${result.error.message} (${result.error.code})`
    } catch {
        return msg
    }
}

interface HandleExceptionOptions {
    /**
     * Custom name to apply to the error
     */
    name?: string
    /**
     * Source to apply to the error
     */
    source?: string
    /**
     * Notification to send to the user
     */
    userMessage?: {
        title: string
        /**
         * Defaults to error's message
         */
        description?: string
    }
    /**
     * If true, applies a fingerprint to group the errors by source and name
     */
    groupInSentry?: boolean
    /**
     * Additional information to be logged and sent to Sentry
     */
    extra?: Extras
}

/**
 * Captures and handles an exception with Sentry and user notification
 */
export const handleException = (
    err: unknown,
    {
        name = err instanceof Error ? err.name : 'CapturedError',
        source = name ?? 'unspecified',
        userMessage,
        groupInSentry,
        extra,
    }: HandleExceptionOptions
): void => {
    const captured = new CapturedError(
        name,
        extractErrorMessage(err) ?? 'unknown',
        source,
        err
    )

    // Log error details
    console.error(`[${captured.name}] (from ${captured.source})`)
    console.error(captured)
    console.error(captured.originalError)
    if (extra) {
        console.table(
            Object.entries(extra).map(([k, v]) => ({
                key: k,
                value: v,
            }))
        )
    }

    // Notify user
    notify({
        message: userMessage?.title ?? name ?? 'Unknown Error',
        description: userMessage?.description ?? captured.message,
        type: 'error',
    })

    // Prepare and send to Sentry
    const sentryArgs: CaptureContext = {
        tags: {
            source,
        },
        extra: {
            ...extra,
            originalError: captured.originalError,
            userMessage,
            originalStack:
                captured.originalError instanceof Error
                    ? captured.originalError.stack
                    : undefined,
        },
    }
    if (groupInSentry) {
        sentryArgs.fingerprint = [captured.name, source]
    }
    Sentry.captureException(captured, sentryArgs)
}