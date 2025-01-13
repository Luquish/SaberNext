'use client'

import { fetchNullableWithSessionCache } from '@rockooor/sail'
import type { Network } from '@saberhq/solana-contrib'
import { formatNetwork } from '@saberhq/solana-contrib'
import { useQuery } from '@tanstack/react-query'
import { BsGear } from 'react-icons/bs'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { CardWithImage } from '@/components/tribeca/CardWithImage'
import { ExternalLink } from '@/components/tribeca/typography/ExternalLink'
import { ProseSmall } from '@/components/tribeca/typography/Prose'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'

/**
 * Constructs the API URL for fetching DAO configuration
 */
const makeAPIUrl = (network: Network, slug: string): string =>
    `https://api.github.com/repos/TribecaHQ/tribeca-registry/contents/config/${formatNetwork(
        network
    )}/${slug}/Tribeca.toml`

/**
 * Component that displays and allows editing of DAO configuration
 */
function ConfigTab() {
    const { meta } = useGovernor()
    const { network } = useEnvironment()

    const { data: configToml } = useQuery({
        queryKey: ['daoToml', network, meta?.slug],
        queryFn: async () => {
            if (!meta) {
                return meta
            }
            const data = await fetchNullableWithSessionCache<{
                content: string
            }>(makeAPIUrl(network, meta?.slug))
            if (!data) {
                return data
            }
            return Buffer.from(data.content, 'base64').toString('utf-8')
        },
    })

    return (
        <div className="flex flex-col gap-4">
            <CardWithImage
                title="Configure your DAO"
                image={
                    <div className="flex items-center justify-center h-full">
                        <BsGear className="w-20 h-20" />
                    </div>
                }
            >
                <ProseSmall>
                    <p>
                        Your DAO manifest controls the features available to members of your
                        DAO.
                    </p>
                    <ExternalLink href="https://github.com/tribecahq/tribeca-registry">
                        Learn more
                    </ExternalLink>
                </ProseSmall>
            </CardWithImage>
            <Card
                title={
                    <>
                        <span>DAO Configuration</span>
                        <a
                            href={`https://github.com/TribecaHQ/tribeca-registry/edit/master/config/${formatNetwork(
                                network
                            )}/${meta?.slug ?? ''}/Tribeca.toml`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button>Edit</Button>
                        </a>
                    </>
                }
                titleStyles={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                padded
            >
                <div className="overflow-x-scroll whitespace-nowrap">
                    <ProseSmall>
                        <pre>{typeof configToml === 'string' ? configToml : null}</pre>
                    </ProseSmall>
                </div>
            </Card>
        </div>
    )
}

export default ConfigTab