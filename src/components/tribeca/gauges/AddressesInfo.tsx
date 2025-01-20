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
        <Card title="Related Accounts" bodyScrollX className="w-full">
            <TableCardBody>
                {Object.entries(addresses).map(([key, info]) => (
                    <tr 
                        key={key} 
                        className="border-b border-warmGray-800/20 last:border-b-0"
                    >
                        <td className="py-6 pl-7">
                            <div>
                                <div className="text-white font-semibold">
                                    {info.label}
                                </div>
                                <div className="text-gray-400">
                                    {info.description}
                                </div>
                            </div>
                        </td>
                        <td className="py-6 pr-7 text-right">
                            <AddressWithContext
                                pubkey={new PublicKey(info.address.toString())}
                                prefixLinkUrlWithAnchor
                                className="text-saber"
                            />
                        </td>
                    </tr>
                ))}
            </TableCardBody>
        </Card>
    )
}

export { AddressesInfo }