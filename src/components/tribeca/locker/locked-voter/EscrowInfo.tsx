'use client'

import { useToken, useUserATAs } from '@rockooor/sail'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

import { Button } from '@/components/tribeca/Button'
import { ContentLoader } from '@/components/tribeca/ContentLoader'
import { Card } from '@/components/tribeca/Card'
import { CardItem } from '@/components/tribeca/CardItem'
import { TokenAmountDisplay } from '@/components/tribeca/TokenAmountDisplay'
import { TokenIcon } from '@/components/tribeca/TokenIcon'
import { useSDK } from '@/contexts/tribeca/sdk'
import { useLocker, useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { LockEscrowModal } from './LockEscrowModal'

interface EscrowInfoProps {
    className?: string
}

/**
 * Loading placeholder for buttons
 */
function ButtonLoader() {
    return (
        <div className="w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]" />
    )
}

interface OuterButtonContainerProps {
    children: React.ReactNode
    escrowExists: boolean
}

/**
 * Container component that adjusts width based on escrow existence
 */
function OuterButtonContainer({ children, escrowExists }: OuterButtonContainerProps) {
    if (!escrowExists) {
        return <div className="w-full">{children}</div>
    }
    return <div className="w-1/2">{children}</div>
}

/**
 * Component that displays voting wallet information including token balances
 * and lock/extend functionality
 */
function EscrowInfo({ className }: EscrowInfoProps) {
    const router = useRouter()
    const { lockerSubpage } = useParams<{ lockerSubpage: string }>()
    const { governor, path } = useGovernor()
    const { data: locker } = useLocker()
    const { data: govToken } = useToken(locker?.account.tokenMint)
    const [govTokenBalance] = useUserATAs(govToken)
    const { data: escrow, isLoading, govTokensLocked } = useUserEscrow()
    const { sdkMut } = useSDK()

    const lockModalVariant = lockerSubpage === 'lock' || lockerSubpage === 'extend'
        ? lockerSubpage
        : null
    const showModal = !!lockModalVariant

    return (
        <Card className={className} title="Voting Wallet">
            <LockEscrowModal
                variant={lockModalVariant}
                escrowW={escrow?.escrowW ?? null}
                isOpen={showModal}
                onDismiss={() => router.push(`/gov/${governor.toString()}/locker`)}
            />
            <CardItem label={`${govToken?.symbol ?? 'Token'} Balance`}>
                <div className="flex items-center gap-2.5 h-7">
                    {govTokenBalance ? (
                        <TokenAmountDisplay
                            amount={govTokenBalance.balance}
                            showSymbol={false}
                        />
                    ) : (
                        <div className="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
                    )}
                    <TokenIcon size={18} token={govToken} />
                </div>
            </CardItem>
            <CardItem label={`Your ${govToken?.symbol ?? 'Token'} Locked`}>
                <div className="flex items-center gap-2.5 h-7">
                    {govTokensLocked ? (
                        <TokenAmountDisplay amount={govTokensLocked} showSymbol={false} />
                    ) : (
                        <ContentLoader className="h-4 w-12" />
                    )}
                    <TokenIcon size={18} token={govToken} />
                </div>
            </CardItem>
            <div className="px-7 py-4 flex gap-4">
                {!escrow && isLoading ? (
                    <>
                        <ButtonLoader />
                        <ButtonLoader />
                    </>
                ) : !sdkMut ? (
                    <ButtonLoader />
                ) : (
                    <>
                        <OuterButtonContainer escrowExists={!!escrow}>
                            <Link href={`${path}/locker/lock`} className="flex-grow">
                                <Button
                                    className="w-full hover:dark:text-primary hover:dark:border-primary"
                                    type="button"
                                    size="md"
                                    variant="outline"
                                >
                                    Lock
                                </Button>
                            </Link>
                        </OuterButtonContainer>
                        {escrow && (
                            <OuterButtonContainer escrowExists={true}>
                                <Link href={`${path}/locker/extend`} className="flex-grow">
                                    <Button
                                        className="w-full hover:dark:text-primary hover:dark:border-primary"
                                        type="button"
                                        size="md"
                                        variant="outline"
                                    >
                                        Extend
                                    </Button>
                                </Link>
                            </OuterButtonContainer>
                        )}
                    </>
                )}
            </div>
        </Card>
    )
}

export { EscrowInfo }