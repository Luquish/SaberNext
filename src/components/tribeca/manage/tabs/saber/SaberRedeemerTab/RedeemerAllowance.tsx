'use client'

import { associated } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useSail, useToken } from '@rockooor/sail'
import { Saber, SABER_ADDRESSES, SBR_ADDRESS } from '@saberhq/saber-periphery'
import { TokenAmount, u64 } from '@saberhq/token-utils'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import invariant from 'tiny-invariant'

import { AsyncButton } from '@/components/tribeca/AsyncButton'
import { AttributeList } from '@/components/tribeca/AttributeList'
import { Card } from '@/components/tribeca/Card'
import { useExecutiveCouncil } from '@/hooks/tribeca/useExecutiveCouncil'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { useSaberMinterInfoData } from '@/utils/tribeca/parsers'

const AIRDROP_REDEEMER = new PublicKey('3pgqyLSjFXoEw8tMJMXqGmVzFnvx9gMxQEPtNotCFXPn')
const INITIAL_ALLOWANCE = new u64('1000000000000000')

interface RedeemerAllowanceProps {
    redeemer: PublicKey
}

/**
 * Component for managing redeemer allowances and minter creation
 */
function RedeemerAllowance({ redeemer }: RedeemerAllowanceProps) {
    const { ownerInvokeTX, ownerInvokerKey } = useExecutiveCouncil()
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()
    const { data: token } = useToken(SBR_ADDRESS)

    const { data: minterInfoKey } = useQuery({
        queryKey: ['minterInfo', redeemer.toString()],
        queryFn: async () => {
            const minterInfo = await associated(
                SABER_ADDRESSES.MintProxy,
                redeemer.toBuffer()
            )
            return minterInfo
        },
    })
    const { data: minterInfo } = useSaberMinterInfoData(minterInfoKey)

    const initialAllowance = redeemer.equals(AIRDROP_REDEEMER)
        ? new u64('19623303047530')
        : INITIAL_ALLOWANCE
    const initialAmount = token ? new TokenAmount(token, initialAllowance) : null

    return (
        <Card title="Increase Allowance">
            <AttributeList
                attributes={{
                    Minter: redeemer,
                    'Minter Info': minterInfoKey,
                    'Initial Amount': initialAmount,
                    'Allowance Remaining':
                        token && minterInfo
                            ? new TokenAmount(token, minterInfo.account.allowance)
                            : null,
                }}
            />
            {minterInfo ? (
                <AsyncButton
                    className="mt-6"
                    disabled={!token || !initialAmount || !ownerInvokerKey}
                    onClick={async (sdkMut) => {
                        invariant(ownerInvokerKey)
                        invariant(token && initialAmount, 'token')
                        const saberSDK = Saber.load({ provider: sdkMut.provider })
                        const minterInfo =
                            await saberSDK.mintProxy.program.account.minterInfo.associatedAddress(
                                redeemer
                            )
                        const minterUpdateTX = await saberSDK.mintProxy.program.methods
                            .minterUpdate(initialAmount.toU64())
                            .accounts({
                                auth: { owner: ownerInvokerKey },
                                minterInfo,
                            })
                            .instruction()
                        await ownerInvokeTX(
                            sdkMut.provider.newTX([minterUpdateTX]),
                            'Update minter'
                        )
                    }}
                >
                    {`Set Allowance to ${initialAmount?.formatUnits() ?? '--'}`}
                </AsyncButton>
            ) : (
                <AsyncButton
                    className="mt-6"
                    onClick={async (sdkMut) => {
                        invariant(initialAmount, 'initial amount')
                        const saber = Saber.load({ provider: sdkMut.provider })
                        const minterAddTX = await saber.mintProxy.minterAdd(
                            redeemer,
                            initialAmount.toU64()
                        )
                        await handleTX(await wrapTx(minterAddTX), 'Add Minter')
                    }}
                >
                    Create Minter
                </AsyncButton>
            )}
        </Card>
    )
}

export { RedeemerAllowance }