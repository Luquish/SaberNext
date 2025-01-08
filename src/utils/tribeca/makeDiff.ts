import { isPublicKey } from '@saberhq/solana-contrib'
import { isBN } from 'bn.js'
import * as Diff from 'diff'
import * as yaml from 'js-yaml'
import { chunk } from 'lodash-es'

/**
 * Custom replacer for YAML serialization
 */
const replacer = (_: string, value: unknown) => {
    if (isPublicKey(value) || isBN(value)) {
        return value.toString()
    }
    return value
}

/**
 * Formats an object as YAML string
 */
export const fmtObject = (object: Record<string, unknown>) =>
    yaml.dump(object, { replacer })

/**
 * Creates a diff between two objects using YAML representation
 */
export const makeObjectDiff = (
    prev: Record<string, unknown> | null,
    next: Record<string, unknown> | null
) => {
    const prevStr = prev === null ? '' : yaml.dump(prev, { replacer, sortKeys: true })
    const nextStr = next === null ? '' : yaml.dump(next, { replacer, sortKeys: true })
    const diff = prev && next ? Diff.diffLines(prevStr, nextStr) : null
    
    return { prevStr, nextStr, diff }
}

/**
 * Creates a diff between two buffers using hex representation
 */
export function makeBufferDiff(prev: Buffer | null, next: Buffer | null) {
    const prevStr = prev === null
        ? ''
        : chunk(prev.toString('hex'), 2)
            .map((v) => v.join(''))
            .join(' ')
            
    const nextStr = next === null
        ? ''
        : chunk(next.toString('hex'), 2)
            .map((v) => v.join(''))
            .join(' ')
            
    const diff = prev && next ? Diff.diffChars(prevStr, nextStr) : null
    
    return { prevStr, nextStr, diff }
}