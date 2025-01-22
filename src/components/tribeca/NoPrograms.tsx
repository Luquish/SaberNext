'use client'

import type { PublicKey } from '@solana/web3.js'
import { GiTumbleweed } from 'react-icons/gi'

import { AddressLink } from './AddressLink'
import { EmptyState } from './EmptyState'

interface Props {
    smartWallet: PublicKey
}

/**
 * Component shown when a DAO has no programs
 */
function NoPrograms({ smartWallet }: Props) {
    return (
        <EmptyState
            icon={<GiTumbleweed size={80}/>}
            title="This DAO doesn't own any programs."
        >
            <div className="text-center">
                <span>
                    The DAO at address <AddressLink address={smartWallet} showCopy />{' '}
                    does not own any programs.
                </span>
                <p>
                    <a
                        className="text-saber"
                        href="https://docs.solana.com/cli/deploy-a-program#set-a-programs-upgrade-authority"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Read the Solana Wiki to learn more about upgrade authorities.
                    </a>
                </p>
            </div>
        </EmptyState>
    )
}

export { NoPrograms }