'use client'

import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { generateSHA256BufferHash } from '@/utils/tribeca/crypto'

// CHEQUEAR
function toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length)
    const view = new Uint8Array(arrayBuffer)
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i]
    }
    return arrayBuffer
}

/**
 * Hook to generate SHA256 hash from a buffer
 */
function useSha256Sum(buffer?: Buffer | null) {
    return useQuery({
        queryKey: ['sha256sum', buffer?.toString()],
        queryFn: async () => {
            invariant(buffer, 'Buffer is required')
            return generateSHA256BufferHash(toArrayBuffer(buffer))
        },
        enabled: !!buffer,
    })
}

/**
 * Truncates a SHA sum to show only the beginning and end
 * @param sum - The full SHA sum
 * @param leading - Number of leading characters to show (default: 4)
 */
function truncateShasum(sum: string, leading = 4): string {
    return `${sum.slice(0, leading)}...${sum.slice(-4)}`
}

export { useSha256Sum, truncateShasum }