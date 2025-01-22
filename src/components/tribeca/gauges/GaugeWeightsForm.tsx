'use client'

import type { QuarryInfo } from '@rockooor/react-quarry'
import { useRewarder } from '@rockooor/react-quarry'
import { usePubkeysMemo, useTokens } from '@rockooor/sail'
import { useState, useEffect } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/tribeca/Button'
import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { EmptyState, EmptyStateConnectWallet } from '@/components/tribeca/EmptyState'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useUpdateGaugeWeights } from '@/hooks/tribeca/gauges/useUpdateGaugeWeights'
import { useAllGauges } from '@/hooks/tribeca/gauges/useGauges'
import { GaugeWeightRow } from './GaugeWeightRow'
import { SetWeightsModal } from './SetWeightsModal'

interface GaugeWeightsFormProps {
    filterTerm: string
}

/**
 * Form component for managing gauge weights
 */
function GaugeWeightsForm({ filterTerm }: GaugeWeightsFormProps) {
    const params = useParams()
    const dao = params.dao
    
    const { escrow, isLoading } = useUserEscrow()
    const { quarries, quarriesLoading } = useRewarder()
    const [filteredQuarries, setFilteredQuarries] = useState<readonly QuarryInfo[]>([])
    const { sharesDiff } = useUpdateGaugeWeights()
    const { gauges } = useAllGauges()
    const { sdkMut } = useSDK()

    const allTokens = useTokens(
        usePubkeysMemo(
            quarries?.map((quarry) => quarry.quarry.account.tokenMintKey) ?? [],
        ),
    )

    useEffect(() => {
        if (filterTerm === '') {
            setFilteredQuarries(quarries ?? [])
            return
        }

        const filterQuarries = (quarries: readonly QuarryInfo[]) => {
            return quarries.filter((quarry) => {
                const tokenName = allTokens
                    .find((tok) => tok.data?.mintAccount.equals(quarry.quarry.account.tokenMintKey))
                    ?.data?.name.toLowerCase()
                return tokenName?.includes(filterTerm.toLowerCase())
            })
        }

        const delaySearch = setTimeout(() => {
            if (quarries) {
                setFilteredQuarries(filterQuarries(quarries))
            }
        }, 100)

        return () => clearTimeout(delaySearch)
    }, [allTokens, filterTerm, quarries])

    if (quarriesLoading) {
        return <LoadingPage className="p-16" />
    }

    if (!sdkMut) {
        return <EmptyStateConnectWallet title="Connect your wallet to vote on gauges." />
    }

    if (!escrow && !isLoading) {
        return (
            <EmptyState
                title="Locker Escrow Not Found"
                icon={<FaExclamationCircle />}
            >
                <div className="py-2.5">
                    <Link href={`/gov/${dao}/locker`}>
                        <Button
                            variant="primary"
                            className="w-full rounded text-sm font-semibold transition-colors"
                        >
                            Lock Tokens
                        </Button>
                    </Link>
                </div>
            </EmptyState>
        )
    }

    return (
        <>
            <div className="overflow-x-auto">
                <TableCardBody
                    head={
                        <tr>
                            <th>Token</th>
                            <th>Current Share (%)</th>
                            <th>Weight</th>
                            <th>New Share (%)</th>
                        </tr>
                    }
                >
                    {filteredQuarries.map((quarry) =>
                        gauges?.find(
                            (gauge) =>
                                gauge?.account.quarry.equals(quarry.key) &&
                                !gauge.account.isDisabled,
                        ) ? (
                                <GaugeWeightRow 
                                    key={quarry.key.toString()} 
                                    quarry={quarry} 
                                />
                            ) : null,
                    )}
                </TableCardBody>
            </div>
            <div className="w-full flex flex-col items-center p-8">
                <ModalButton
                    buttonLabel="Update Weights"
                    buttonProps={{
                        variant: 'outline',
                        disabled: sharesDiff.length === 0,
                        className: 'w-3/5 hover:not-disabled:(border-saber text-saber)',
                    }}
                >
                    <SetWeightsModal />
                </ModalButton>
            </div>
        </>
    )
}

export { GaugeWeightsForm }