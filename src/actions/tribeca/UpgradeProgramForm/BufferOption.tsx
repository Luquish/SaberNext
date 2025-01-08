'use client'

import type { ProgramDeployBuffer } from '@/hooks/tribeca/useAuthorityPrograms'
import { truncateShasum } from '@/hooks/tribeca/useSha256Sum'
import { displayAddress } from '@/utils/tribeca/programs'

interface Props {
    buffer: ProgramDeployBuffer
}

/**
 * Renders a select option for a program deploy buffer
 * Displays the buffer's address and truncated SHA256 hash
 */
function BufferOption({ buffer }: Props) {
    const shasum = buffer.sha256Sum
    
    return (
        <option 
            key={buffer.pubkey.toString()} 
            value={buffer.pubkey.toString()}
        >
            {displayAddress(buffer.pubkey.toString())}
            {` (SHA256: ${truncateShasum(shasum)})`}
        </option>
    )
}

export { BufferOption }