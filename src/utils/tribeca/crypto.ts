'use client'

/**
 * SubtleCrypto instance or null if not available (e.g., on HTTP)
 */
const crypto: null | SubtleCrypto = window?.crypto?.subtle ?? null

/**
 * Converts a number to a two-digit hex string
 */
const i2hex = (i: number): string => {
    return ('00' + i.toString(16)).slice(-2)
}

/**
 * Converts a Uint8Array to a hex string
 */
const generateHexFromUint8Array = (arr: Uint8Array): string => {
    return Array.prototype.map.call(arr, i2hex).join('')
}

/**
 * Generates SHA-256 hash using native crypto API
 */
const generateSHA256HashNative = async (
    crypto: SubtleCrypto,
    arrayBuffer: ArrayBuffer
): Promise<Uint8Array> => {
    const buf = await crypto.digest('SHA-256', arrayBuffer)
    return new Uint8Array(buf)
}

/**
 * Generates SHA-256 hash using fast-sha256 fallback
 */
const generateSHA256HashFallback = async (
    arrayBuffer: ArrayBuffer
): Promise<Uint8Array> => {
    const { hash } = await import('fast-sha256')
    return hash(new Uint8Array(arrayBuffer))
}

/**
 * Generates a SHA-256 hash of a buffer and returns it as a hex string
 * Falls back to fast-sha256 if native crypto is not available
 */
export const generateSHA256BufferHash = async (
    buffer: ArrayBuffer
): Promise<string> => {
    const rawHash = await (crypto
        ? generateSHA256HashNative(crypto, buffer)
        : generateSHA256HashFallback(buffer))
    return generateHexFromUint8Array(rawHash)
}
