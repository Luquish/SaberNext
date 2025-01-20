'use client'

import { ZERO } from '@quarryprotocol/quarry-sdk'
import { useSail, useUserATAs } from '@rockooor/sail'
import { Fraction, sleep, TokenAmount } from '@saberhq/token-utils'
import type { VoteEscrow } from '@tribecahq/tribeca-sdk'
import { LockerWrapper } from '@tribecahq/tribeca-sdk'
import BN from 'bn.js'
import { formatDuration } from 'date-fns/formatDuration'
import { useEffect, useState } from 'react'
import { FaArrowDown } from 'react-icons/fa'
import invariant from 'tiny-invariant'

import { AttributeList } from '@/components/tribeca/AttributeList'
import { Button } from '@/components/tribeca/Button'
import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { HelperCard } from '@/components/tribeca/HelperCard'
import { InputSlider } from '@/components/tribeca/inputs/InputSlider'
import { InputTokenAmount } from '@/components/tribeca/inputs/InputTokenAmount'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import type { ModalProps } from '@/components/tribeca/Modal'
import { Modal } from '@/components/tribeca/Modal'
import { ModalInner } from '@/components/tribeca/Modal/ModalInner'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useLocker, useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useParseTokenAmount } from '@/hooks/tribeca/useParseTokenAmount'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { tsToDate } from '@/utils/tribeca/utils'
import { Duration } from 'date-fns'

// Constants
const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24
const ONE_YEAR = ONE_DAY * 365

interface LockEscrowModalProps extends Omit<ModalProps, 'children'> {
    escrowW: VoteEscrow | null
    variant: 'lock' | 'extend' | null
}

/**
 * Normalizes a duration in seconds to a Duration object
 */
function normalizeDuration(seconds: number): Duration {
    if (seconds >= ONE_YEAR) {
        return {
            years: Math.floor(seconds / ONE_YEAR) || undefined,
            days: Math.floor((seconds % ONE_YEAR) / ONE_DAY) || undefined,
        }
    }
    if (seconds >= ONE_DAY) {
        return { days: Math.floor(seconds / ONE_DAY) || undefined }
    }
    if (seconds >= ONE_HOUR) {
        return { hours: Math.floor(seconds / ONE_HOUR) }
    }
    if (seconds >= ONE_MINUTE) {
        return { minutes: Math.floor(seconds / ONE_MINUTE) }
    }
    return { seconds }
}

/**
 * Generates nice preset durations between min and max lockup times
 */
function nicePresets(
    minLockupSeconds: number,
    maxLockupSeconds: number
): { duration: Duration; seconds: number }[] {
    const result = []
    if (minLockupSeconds < ONE_DAY) {
        result.push(ONE_MINUTE)
        result.push(ONE_HOUR)
    }
    if (maxLockupSeconds > ONE_DAY * 30) {
        result.push(ONE_DAY * 30)
    }
    if (maxLockupSeconds > ONE_YEAR) {
        result.push(ONE_YEAR)
    }
    return [minLockupSeconds, ...result, maxLockupSeconds].map((seconds) => ({
        seconds,
        duration: normalizeDuration(seconds),
    }))
}

/**
 * Modal component for locking or extending token lockups
 */

function LockEscrowModal({ variant, ...modalProps }: LockEscrowModalProps) {
    const { tribecaMut } = useSDK()
    const { governor, veToken, govToken, lockerData } = useGovernor()
    const { data: locker } = useLocker()
    const { data: escrow, refetch } = useUserEscrow()
    const [userBalance] = useUserATAs(govToken)
    const [lockDurationSeconds, setDurationSeconds] = useState<string>(
        lockerData?.account.params.minStakeDuration.toString() ?? ''
    )
    const parsedDurationSeconds = lockDurationSeconds
        ? parseFloat(lockDurationSeconds)
        : null

    useEffect(() => {
        if (lockerData && parsedDurationSeconds === null) {
            setDurationSeconds(lockerData.account.params.minStakeDuration.toString())
        }
    }, [lockerData, parsedDurationSeconds])

    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    const durations = locker
        ? ([
            locker.account.params.minStakeDuration.toNumber(),
            locker.account.params.maxStakeDuration.toNumber(),
        ] as const)
        : locker

    const durationPresets = durations
        ? nicePresets(durations[0], durations[1])
        : []

    const [depositAmountStr, setDepositAmountStr] = useState<string>('0')
    const depositAmount = useParseTokenAmount(govToken, depositAmountStr)

    const prevUnlockTime = escrow ? tsToDate(escrow.escrow.escrowEndsAt) : null
    const unlockTime = parsedDurationSeconds
        ? new Date(Date.now() + parsedDurationSeconds * 1_000)
        : null
    const isInvalidUnlockTime =
        prevUnlockTime && unlockTime && unlockTime < prevUnlockTime

    const currentVotingPower = veToken
        ? new TokenAmount(
            veToken,
            escrow ? escrow.calculateVotingPower(Date.now() / 1_000) : 0
        )
        : null

    const newDeposits = govToken
        ? new TokenAmount(govToken, escrow?.escrow?.amount ?? 0).add(
            new TokenAmount(govToken, depositAmount?.raw ?? 0)
        )
        : null
    const newVotingPower =
        newDeposits && locker && veToken && parsedDurationSeconds
            ? new TokenAmount(
                veToken,
                new Fraction(newDeposits.raw)
                    .multiply(locker.account.params.maxStakeVoteMultiplier)
                    .multiply(parsedDurationSeconds)
                    .divide(locker.account.params.maxStakeDuration).quotient
            )
            : null

    return (
        <Modal className="p-0 dark:text-white" {...modalProps}>
            <ModalInner
                className="p-0"
                title={variant === 'extend' ? 'Extend Lockup' : 'Lock Tokens'}
            >
                <div className="px-8 py-4">
                    <div className="flex flex-col gap-8">
                        {variant === 'extend' && (
                            <HelperCard>
                                <p>
                                    Extend your lockup to increase the voting power of your
                                    current token stake.
                                </p>
                            </HelperCard>
                        )}
                        {variant === 'lock' && (
                            <InputTokenAmount
                                tokens={[]}
                                label="Deposit Amount"
                                token={govToken ?? null}
                                inputValue={depositAmountStr}
                                inputOnChange={setDepositAmountStr}
                                currentAmount={{
                                    amount: userBalance?.balance,
                                    allowSelect: true,
                                }}
                            />
                        )}
                        <div>
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-sm">Lock Period</span>
                                <div
                                    className={`text-4xl my-6 h-12 ${
                                        isInvalidUnlockTime ? 'text-red-500' : ''
                                    }`}
                                >
                                    {parsedDurationSeconds ? (
                                        formatDuration(
                                            normalizeDuration(parsedDurationSeconds),
                                            { zero: true }
                                        )
                                    ) : (
                                        <ContentLoader className="h-8 w-16" />
                                    )}
                                </div>
                                <div className="w-11/12 mx-auto my-4">
                                    <InputSlider
                                        value={parsedDurationSeconds ? [parsedDurationSeconds] : undefined}
                                        min={durations?.[0]}
                                        max={durations?.[1]}
                                        step={1}
                                        onValueChange={(values) => setDurationSeconds(values[0].toFixed(2))}
                                    />
                                </div>
                                <div className="flex gap-4 mx-auto mt-4 flex-wrap">
                                    {durationPresets.map(({ duration, seconds }, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            className="px-4 rounded border-primary hover:border-primary bg-saber bg-opacity-20"
                                            onClick={() => {
                                                setDurationSeconds(seconds.toString())
                                            }}
                                        >
                                            {formatDuration(duration, { zero: true })}
                                        </Button>
                                    ))}
                                </div>
                                <div className="py-6 flex items-center justify-center">
                                    <FaArrowDown />
                                </div>
                                <div className="mb-6 border rounded border-warmGray-800">
                                    {!veToken ? (
                                        <div className="w-full py-5 flex items-center justify-center">
                                            <LoadingSpinner className="h-8 w-8" />
                                        </div>
                                    ) : (
                                        <AttributeList
                                            rowStyles={{ alignItems: 'start', gap: '4' }}
                                            labelStyles={{ width: '32' }}
                                            valueStyles={{ flex: 'grow' }}
                                            transformLabel={false}
                                            attributes={{
                                                [`${veToken.symbol} balance`]: (
                                                    <div className="flex flex-col">
                                                        <div>
                                                            <span className="text-warmGray-400">
                                                                Prev:{' '}
                                                            </span>
                                                            <span>
                                                                {currentVotingPower?.toExact({
                                                                    groupSeparator: ',',
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-warmGray-400">
                                                                Next:{' '}
                                                            </span>
                                                            <span>
                                                                {newVotingPower?.toExact({
                                                                    groupSeparator: ',',
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                                'Unlock Time': (
                                                    <div className="flex flex-col">
                                                        <div>
                                                            <span className="text-warmGray-400">
                                                                Prev:{' '}
                                                            </span>
                                                            <span>
                                                                {prevUnlockTime?.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        timeZoneName: 'short',
                                                                    }
                                                                ) ?? 'n/a'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-warmGray-400">
                                                                Next:{' '}
                                                            </span>
                                                            <span>
                                                                {unlockTime?.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        timeZoneName: 'short',
                                                                    }
                                                                ) ?? '--'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            }}
                                        />
                                    )}
                                </div>
                                {isInvalidUnlockTime && (
                                    <HelperCard
                                        variant="error"
                                        className="my-4"
                                    >
                                        <div className="py-2">
                                            <h2 className="text-base text-white mb-2 font-semibold">
                                                You cannot decrease your lock period
                                            </h2>
                                            <p className="mb-1">
                                                Your existing lock period ends at{' '}
                                                {prevUnlockTime.toLocaleString()}. Any
                                                updates to your vote escrow must result in a
                                                lockup that ends at or after this date.
                                            </p>
                                            <p>
                                                You may use a separate wallet in order to
                                                maintain multiple lockups of varying expiries.
                                            </p>
                                        </div>
                                    </HelperCard>
                                )}
                                <Button
                                    size="md"
                                    variant="primary"
                                    disabled={
                                        !tribecaMut ||
                                        !locker ||
                                        !!isInvalidUnlockTime ||
                                        !parsedDurationSeconds ||
                                        !depositAmount ||
                                        (variant !== 'extend' &&
                                            depositAmount.toU64().isZero())
                                    }
                                    onClick={async () => {
                                        invariant(
                                            tribecaMut &&
                                                locker &&
                                                parsedDurationSeconds &&
                                                depositAmount
                                        )
                                        const lockerW = new LockerWrapper(
                                            tribecaMut,
                                            locker.publicKey,
                                            governor
                                        )
                                        const tx = await lockerW.lockTokens({
                                            amount:
                                                variant === 'extend'
                                                    ? ZERO
                                                    : depositAmount.toU64(),
                                            duration: new BN(parsedDurationSeconds),
                                        })
                                        const { pending, success } = await handleTX(
                                            await wrapTx(tx),
                                            'Lock tokens'
                                        )
                                        if (!pending || !success) {
                                            return
                                        }
                                        await pending.wait()
                                        await sleep(1_000)
                                        await refetch()
                                        modalProps.onDismiss()
                                    }}
                                >
                                    {isInvalidUnlockTime
                                        ? 'Cannot decrease lock time'
                                        : variant === 'extend'
                                            ? 'Extend Lockup'
                                            : 'Lock Tokens'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalInner>
        </Modal>
    )
}

export { LockEscrowModal }