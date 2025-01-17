'use client'

import { findSubaccountInfoAddress } from '@gokiprotocol/client'
import { useTXHandlers } from '@rockooor/sail'
import { PublicKey, TransactionEnvelope } from '@saberhq/solana-contrib'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useSDK } from '@/contexts/tribeca/sdk'
import {
    useBatchedSubaccountInfos,
    useGokiSmartWalletData,
} from '@/utils/tribeca/parsers'
import { useOwnerInvokerAddress } from '@/hooks/tribeca/useSmartWalletAddress'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { useGovernor } from '@/hooks/tribeca/useGovernor'

/**
 * Hook to manage Executive Council interactions
 */
export const useExecutiveCouncil = () => {
    const { smartWallet: rawSmartWallet } = useGovernor()
    const smartWallet = useMemo(() => {
        if (!rawSmartWallet) {
            return undefined
        }
        if (rawSmartWallet instanceof PublicKey) {
            return rawSmartWallet
        }
        return rawSmartWallet.account.smartWallet
    }, [rawSmartWallet])
    
    const { data: smartWalletData } = useGokiSmartWalletData(smartWallet)
    const { sdkMut } = useSDK()
    const { signAndConfirmTX } = useTXHandlers()
    const { wrapTx } = useWrapTx()

    // Fetch subaccount info keys
    const { data: subaccountInfoKeys } = useQuery({
        queryKey: ['subaccountInfos', smartWalletData?.publicKey.toString()],
        queryFn: async () => {
            if (!smartWalletData) {
                return smartWalletData
            }
            return Promise.all(
                smartWalletData.account.owners.map(async (swOwner) => {
                    const [sub] = await findSubaccountInfoAddress(swOwner)
                    return sub
                })
            )
        },
        enabled: !!smartWalletData,
    })

    const subaccountInfoKeysArray = Array.isArray(subaccountInfoKeys) 
        ? subaccountInfoKeys 
        : []

    // Get subaccount infos
    const { data: subaccountInfos } = useBatchedSubaccountInfos(subaccountInfoKeysArray)

    // Find owner invoker subaccount
    const subaccountInfo = useMemo(
        () => subaccountInfos?.find(
            (s) => s && 'ownerInvoker' in s.account.subaccountType
        ),
        [subaccountInfos]
    )

    // Get EC wallet data
    const ecKey = subaccountInfo?.account.smartWallet
    const ecWallet = useGokiSmartWalletData(ecKey)
    const { data: ownerInvokerKey } = useOwnerInvokerAddress(ecKey, 0)

    // Check if current user is EC member
    const isMemberOfEC = !!(
        sdkMut &&
        ecWallet.data?.account.owners.find((o) =>
            o.equals(sdkMut.provider.wallet.publicKey)
        )
    )

    /**
     * Build transaction for owner invoke
     */
    const buildOwnerInvokeTX = async (tx: TransactionEnvelope) => {
        if (!isMemberOfEC || !ecWallet.data || !subaccountInfo) {
            throw new Error('Not a member of the Executive Council')
        }

        const sw = await sdkMut.loadSmartWallet(ecWallet.data.publicKey)
        const allTXs = await Promise.all(
            tx.instructions.map(async (instruction) => {
                return sw.ownerInvokeInstructionV2({
                    instruction,
                    index: subaccountInfo.account.index.toNumber(),
                })
            })
        )

        const newTX = TransactionEnvelope.combineAll(...allTXs)
        newTX.addSigners(...tx.signers)
        return newTX
    }

    /**
     * Execute owner invoke transaction
     */
    const ownerInvokeTX = async (
        ...[tx, ...rest]: Parameters<typeof signAndConfirmTX>
    ) => {
        return signAndConfirmTX(
            await wrapTx(await buildOwnerInvokeTX(tx)),
            ...rest
        )
    }

    return {
        ecWallet,
        isMemberOfEC,
        ownerInvokerKey,
        buildOwnerInvokeTX,
        ownerInvokeTX,
    }
}