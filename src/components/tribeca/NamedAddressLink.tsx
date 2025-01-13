'use client'

import { useCardinalDisplayName } from '@/hooks/tribeca/cardinal/useAddressName'
import { AddressLink } from './AddressLink'

type Props = React.ComponentProps<typeof AddressLink>

/**
 * An AddressLink component that displays the Cardinal name for the address if available
 */
function NamedAddressLink({
    address,
    children,
    ...rest
}: Props) {
    const { name } = useCardinalDisplayName(address)
    
    return (
        <AddressLink address={address} {...rest}>
            {children ?? (name?.toString() ?? undefined)}
        </AddressLink>
    )
}

export { NamedAddressLink }