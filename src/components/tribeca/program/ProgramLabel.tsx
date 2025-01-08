'use client'

import { useProgramLabel } from '@/hooks/tribeca/useProgramMeta'
import { SYSVAR_OWNER } from '@/utils/tribeca/programs'
import { AddressLink } from '../AddressLink'

type ProgramLabelProps = React.ComponentProps<typeof AddressLink>

/**
 * Renders a program label with address link
 */
function ProgramLabel({ address, ...rest }: ProgramLabelProps) {
    const label = useProgramLabel(address)

    if (address.equals(SYSVAR_OWNER)) {
        return <span>SYSVAR</span>
    }

    return (
        <AddressLink
            className="dark:text-primary hover:text-opacity-80"
            address={address}
            {...rest}
        >
            {label}
        </AddressLink>
    )
}

export type { ProgramLabelProps }
export { ProgramLabel }