'use client'

import { mapSome, tsToDate } from '@saberhq/solana-contrib'

import { EmptyState } from '@/components/tribeca/EmptyState'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { useSmartWallet } from '@/hooks/tribeca/useSmartWallet'
import { ExecuteProposalButton } from './ExecuteProposalButton'

/**
 * Component that displays and manages pending transactions for the executive council
 */
function PendingTXs() {
    const { parsedTXs, smartWalletData } = useSmartWallet()

    const pendingTXs = parsedTXs?.filter((tx) => {
        if (!tx.tx) {
            return false
        }
        const gracePeriodEnd = mapSome(tx.tx, (t) =>
            mapSome(smartWalletData, (d) =>
                !t.account.eta.isNeg()
                    ? tsToDate(t.account.eta.add(d.account.gracePeriod))
                    : null
            )
        )
        if (gracePeriodEnd && gracePeriodEnd <= new Date()) {
            return false
        }
        return tx.tx?.account.executedAt.isNeg() ?? false
    })

    return (
        <TableCardBody>
            {pendingTXs?.map((tx) => (
                <tr key={tx.tx.publicKey.toString()}>
                    <td>TX-{tx.tx.account.index.toNumber()}</td>
                    <td>{tx.instructions.map((ix) => ix.title).join(', ')}</td>
                    <td>
                        <ExecuteProposalButton tx={tx.tx} />
                    </td>
                </tr>
            ))}
            {pendingTXs?.length === 0 && (
                <EmptyState title="No pending transactions found." />
            )}
            {pendingTXs === undefined && <LoadingPage />}
        </TableCardBody>
    )
}

export { PendingTXs }