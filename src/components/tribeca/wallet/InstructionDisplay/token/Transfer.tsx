'use client'

import { useToken } from '@rockooor/sail'
import { TokenAmount } from '@saberhq/token-utils'

import type { TransferChecked } from '@/utils/tribeca/instructions/token/types'
import { AddressLink } from '@/components/tribeca/AddressLink'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { TokenAmountDisplay } from '@/components/tribeca/TokenAmountDisplay'
import { Box } from '../Box'

interface TransferProps {
    data: TransferChecked
}

/**
 * Component that displays a token transfer summary
 */
function Transfer({
    data: {
        mint,
        tokenAmount: { amount },
        destination,
    },
}: TransferProps) {
    const { data: token } = useToken(mint)
    const amt = token ? new TokenAmount(token, amount) : token

    return (
        <Box title="Summary">
            {amt ? (
                <div className="inline-flex items-center gap-2">
                    Transfer <TokenAmountDisplay amount={amt as TokenAmount} showIcon /> to{' '}
                    <AddressLink address={destination} />
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </Box>
    )
}

export type { TransferProps }
export { Transfer }