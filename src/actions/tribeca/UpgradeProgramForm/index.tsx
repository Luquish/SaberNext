'use client'

import type { Transaction } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { GiTumbleweed } from 'react-icons/gi'

import { AddressLink } from '@/components/tribeca/AddressLink'
import { EmptyState } from '@/components/tribeca/EmptyState'
import { NoPrograms } from '@/components/tribeca/NoPrograms'
import { Select } from '@/components/tribeca/inputs/InputText'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useAuthorityBuffers, useAuthorityPrograms } from '@/hooks/tribeca/useAuthorityPrograms'
import { createUpgradeInstruction } from '@/utils/tribeca/instructions/upgradeable_loader/instructions'
import { makeTransaction } from '@/utils/tribeca/makeTransaction'
import { programLabel } from '@/utils/tribeca/programs'
import { useEnvironment } from '@/hooks/tribeca/useEnvironment'
import { shortenAddress } from '@/utils/tribeca/utils'
import { BufferOption } from './BufferOption'

interface Props {
    onSelect: (tx: Transaction) => void
}

/**
 * Form component for upgrading program with a new buffer
 */
function UpgradeProgramForm({ onSelect }: Props) {
    const { sdkMut } = useSDK()
    const { smartWallet } = useGovernor()
    const finalSmartWallet = smartWallet instanceof PublicKey 
        ? smartWallet 
        : smartWallet.account.smartWallet
    const { data: buffers } = useAuthorityBuffers(finalSmartWallet)
    const { programs, programData } = useAuthorityPrograms(finalSmartWallet)
    const { network } = useEnvironment()

    const [programID, setProgramID] = useState<string | null>(null)
    const [bufferKey, setBufferKey] = useState<string | null>(null)

    useEffect(() => {
        if (!programID || !bufferKey || !sdkMut || !smartWallet) {
            return
        }
        void (async () => {
            const ix = await createUpgradeInstruction({
                program: new PublicKey(programID),
                buffer: new PublicKey(bufferKey),
                spill: sdkMut.provider.wallet.publicKey,
                signer: finalSmartWallet,
            })
            onSelect(makeTransaction(network, [ix]))
        })()
    }, [programID, bufferKey, network, sdkMut, onSelect, smartWallet, finalSmartWallet])

    return (
        <>
            <label className="flex flex-col gap-1" htmlFor="upgradeBuffer">
                <span className="text-sm">Program ID</span>
                {smartWallet ? (
                    <>
                        {programs?.length === 0 && !programData.isLoading ? (
                            <NoPrograms smartWallet={finalSmartWallet} />
                        ) : (
                            <Select
                                onChange={(e) => setProgramID(e.target.value)}
                            >
                                <option>Select a program ID</option>
                                {programs?.map((program) => {
                                    const { data } = program
                                    if (!data) return null
                                    
                                    const programIDStr = data.programID.toString()
                                    const label = programLabel(programIDStr)
                                    return (
                                        <option key={programIDStr} value={programIDStr}>
                                            {label
                                                ? `${label} (${shortenAddress(programIDStr, 3)})`
                                                : shortenAddress(programIDStr, 10)}
                                        </option>
                                    )
                                })}
                            </Select>
                        )}
                    </>
                ) : (
                    <LoadingPage />
                )}
            </label>
            <label className="flex flex-col gap-1" htmlFor="upgradeBuffer">
                <span className="text-sm">New Buffer</span>
                {smartWallet ? (
                    <>
                        {buffers?.length === 0 ? (
                            <EmptyState icon={<GiTumbleweed />} title="No buffers available">
                                <p>
                                    To propose a program upgrade, please upload a buffer with the
                                    <br />
                                    upgrade authority{' '}
                                    <AddressLink address={finalSmartWallet} showCopy /> by following{' '}
                                    <a
                                        className="text-primary hover:underline"
                                        href="https://github.com/gokiprotocol/goki-cli"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        these instructions
                                    </a>
                                    .
                                </p>
                            </EmptyState>
                        ) : (
                            <Select
                                onChange={(e) => setBufferKey(e.target.value)}
                            >
                                <option>Select a buffer</option>
                                {buffers?.map((buffer) => (
                                    <BufferOption
                                        key={buffer.pubkey.toString()}
                                        buffer={buffer}
                                    />
                                ))}
                            </Select>
                        )}
                    </>
                ) : (
                    <LoadingPage />
                )}
            </label>
        </>
    )
}

export { UpgradeProgramForm }