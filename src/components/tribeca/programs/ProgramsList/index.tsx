'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { ProgramInfo, useAuthorityPrograms } from '@/hooks/tribeca/useAuthorityPrograms'
import { Button } from '@/components/tribeca/Button'
import { NoPrograms } from '@/components/tribeca/NoPrograms'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { Notice } from '@/components/tribeca/Notice'
import { ProgramCard } from './ProgramCard'
import { ProgramPlaceholder } from './ProgramPlaceholder'
import { PublicKey } from '@solana/web3.js'

interface Props {
    maxCount?: number
}

export function ProgramsList({ maxCount = 100 }: Props) {
    const { smartWallet, path } = useGovernor()

    const finalSmartWallet = smartWallet instanceof PublicKey 
        ? smartWallet 
        : smartWallet.account.smartWallet

    const { programs, programData } = useAuthorityPrograms(finalSmartWallet)
    const programsToRender = useMemo(
        () => programs.slice(0, maxCount),
        [maxCount, programs]
    )

    if (!smartWallet || programData.isLoading) {
        return (
            <div className='h-[251px] flex items-center justify-center'>
                <LoadingPage />
            </div>
        )
    }

    const isEmpty = programs.length === 0 && programData.isFetched
    if (isEmpty) {
        return <NoPrograms smartWallet={finalSmartWallet} />
    }

    return (
        <>
            {programs.length === 0 &&
                programData.data?.map((pdata) => (
                    <Notice key={pdata.pubkey.toString()}>
                        <LoadingSpinner />
                    </Notice>
                ))}
            <div className='flex flex-col gap-2'>
                {programsToRender.map((program, i) => {
                    return (
                        <div key={(program.data as ProgramInfo)?.programID.toString() ?? `loading_${i}`}>
                            {program.isLoading && <ProgramPlaceholder />}
                            {program.data && (
                                <ProgramCard
                                    program={program.data as ProgramInfo}
                                    actions={
                                        <Link href={`${path}/proposals/create`}>
                                            <Button
                                                className='py-2 px-3 hover:dark:text-primary hover:dark:border-primary'
                                                variant='outline'
                                            >
                                                Upgrade
                                            </Button>
                                        </Link>
                                    }
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )
}