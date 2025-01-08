'use client'

import type { Token } from '@saberhq/token-utils'
import { TokenAmount } from '@saberhq/token-utils'
import { useMemo } from 'react'

/**
 * Hook to parse a string value into a TokenAmount
 * @param token - The token to parse the amount for
 * @param valueStr - The string value to parse
 * @returns TokenAmount if successful, null if parsing fails, undefined if no token
 */
function useParseTokenAmount(
    token: Token | null | undefined,
    valueStr: string
): TokenAmount | null | undefined {
    return useMemo(() => {
        if (!valueStr) {
            return null
        }

        if (!token) {
            return undefined
        }

        try {
            return TokenAmount.parse(token, valueStr)
        } catch (e) {
            return null
        }
    }, [token, valueStr])
}

export { useParseTokenAmount }