'use client'

import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil'
import { NamedAddressLink } from '@/components/tribeca/NamedAddressLink'
import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { HelperCard } from '@/components/tribeca/HelperCard'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'

/**
 * Component that displays information about the Executive Council
 */
function ExecutiveCouncilInfo() {
    const { ecWallet, ownerInvokerKey } = useExecutiveCouncil()

    return (
        <Card title="Executive Council" className="pb-2">
            <div className="px-5 my-5">
                <HelperCard>
                    <p>
                        All members of the Executive Council may execute transactions that
                        have been approved by governance and have surpassed the timelock.
                    </p>
                    <ExternalLink
                        className="mt-2"
                        href="https://docs.tribeca.so/more-resources/recommended-configuration#executive-council"
                    >
                        Learn more
                    </ExternalLink>
                </HelperCard>
            </div>
            <AttributeList
                attributes={{
                    Key: ecWallet.data?.publicKey,
                    'Owner Invoker': ownerInvokerKey,
                    Members: (
                        <div className="flex flex-col gap-1 items-end">
                            {ecWallet.data?.account.owners.map((owner) => (
                                <NamedAddressLink
                                    key={owner.toString()}
                                    address={owner}
                                    showCopy
                                />
                            ))}
                        </div>
                    ),
                }}
            />
        </Card>
    )
}

export { ExecutiveCouncilInfo }