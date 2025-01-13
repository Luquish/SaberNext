'use client'

import { useToken } from '@rockooor/sail'
import { SBR_ADDRESS } from '@saberhq/saber-periphery'
import { TokenAmount } from '@saberhq/token-utils'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { MintInfo } from './MintInfo'
import { MintProxyOwnership } from './MintProxyOwnership'
import { useMintProxyState } from './useMintProxyState'

/**
 * Component for displaying mint proxy information and management
 */
function MintProxy() {
    const { data: token } = useToken(SBR_ADDRESS)
    const { data: state, isLoading } = useMintProxyState()
    const hardCap =
        token && state ? new TokenAmount(token, state.account.hardCap) : null

    const stateData = state?.account
    const attributes = {
        'Hard Cap': hardCap,
        Nonce: stateData?.nonce,
        'Proxy Mint Authority': stateData?.proxyMintAuthority,
        'State Associated Account': stateData?.stateAssociatedAccount,
        Owner: stateData?.owner,
        'Pending Owner': stateData?.pendingOwner,
        'Token Mint': stateData?.tokenMint,
    }

    return (
        <div className="flex flex-col gap-4">
            <Card title="Token Info">
                <MintInfo mint={SBR_ADDRESS} />
            </Card>
            {!isLoading && !state ? (
                <Card title="Mint Proxy" padded>
                    <p>Mint proxy not found.</p>
                </Card>
            ) : (
                <Card title="Mint Proxy">
                    <AttributeList loading={isLoading} attributes={attributes} />
                </Card>
            )}
            <MintProxyOwnership />
        </div>
    )
}

export { MintProxy }