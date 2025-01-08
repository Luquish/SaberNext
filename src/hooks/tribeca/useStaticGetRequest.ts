'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import { exists } from '@saberhq/solana-contrib'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

type StaticGetRequestOptions<T, U> = Omit<
    UseQueryOptions<
        T | null | undefined,
        unknown,
        U | null | undefined,
        [string, string | null | undefined]
    >,
    'queryKey' | 'queryFn'
>

/**
 * Hook to fetch JSON data from a URL with session-level caching
 * @param url - The URL to fetch from
 * @param options - Additional react-query options
 * @returns Query result that won't expire until page refresh
 */
function useStaticGetRequest<T, U = T>(
    url: string | null | undefined,
    options: StaticGetRequestOptions<T, U> = {}
) {
    return useQuery({
        queryKey: ['getRequest', url],
        queryFn: async (): Promise<T | null | undefined> => {
            if (!exists(url)) {
                return url
            }
            return fetchNullableWithSessionCache<T>(url)
        },
        staleTime: Infinity,
        ...options,
    })
}

export { useStaticGetRequest }