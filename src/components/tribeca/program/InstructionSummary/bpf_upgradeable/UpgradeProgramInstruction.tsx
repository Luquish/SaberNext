'use client'

import invariant from 'tiny-invariant'

import type { RichParsedInstruction } from '@/hooks/tribeca/useParsedInstruction'
import { useProgramDeployBuffer } from '@/hooks/tribeca/useAuthorityPrograms'
import { useProgramLabel } from '@/hooks/tribeca/useProgramMeta'
import { AddressLink } from '../../../AddressLink'

interface Props {
    data: RichParsedInstruction
}

/**
 * Component that displays program upgrade instruction details
 */
function UpgradeProgramInstruction({ data }: Props) {
    const bufferID = data.accounts.find(
        (account) => account.name === 'Buffer'
    )?.pubkey
    const programID = data.accounts.find(
        (account) => account.name === 'Program'
    )?.pubkey
    
    invariant(programID && bufferID)
    
    const label = useProgramLabel(programID)
    const { data: programDeployBuffer } = useProgramDeployBuffer(bufferID)

    return (
        <>
            Upgrade Program:&nbsp;
            <AddressLink address={programID}>{label}</AddressLink>
            {programDeployBuffer?.verifiableBuild && (
                <>
                    &nbsp;to&nbsp;
                    <a
                        className="hover:text-saber"
                        href={programDeployBuffer.verifiableBuild.build.build.source}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {programDeployBuffer.verifiableBuild.build.build.tag}
                    </a>
                </>
            )}
        </>
    )
}

export { UpgradeProgramInstruction }