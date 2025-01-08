'use client'

import { PublicKey } from '@solana/web3.js'
import type { TrackedAccountInfo } from '@tribecahq/registry'

import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { Card } from '@/components/tribeca/Card'
import { AddressWithContext } from '@/components/tribeca/program/AddressWithContext'

interface Props {
    addresses: Record<string, TrackedAccountInfo>,
}

/**
 * Component that displays a list of related accounts with their details
 */
function AddressesInfo({ addresses }: Props) {
    return (
        <Card title="Related Accounts" bodyScrollX className="col-span-full">
            <TableCardBody>
                {Object.entries(addresses).map(([key, info]) => (
                    <tr key={key}>
                        <td>
                            <div>
                                <span className="text-white font-semibold">
                                    {info.label}
                                </span>
                                <p className="text-gray">
                                    {info.description}
                                </p>
                            </div>
                        </td>
                        <td>
                            <AddressWithContext
                                pubkey={new PublicKey(info.address.toString())}
                                prefixLinkUrlWithAnchor
                            />
                        </td>
                    </tr>
                ))}
            </TableCardBody>
        </Card>
    )
}

export { AddressesInfo }