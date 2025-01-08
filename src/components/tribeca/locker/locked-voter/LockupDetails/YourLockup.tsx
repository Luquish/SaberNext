'use client'

import { useSail } from '@rockooor/sail'
import { formatDistance } from 'date-fns'

import { Button } from '@/components/tribeca/Button'
import { Card } from '@/components/tribeca/Card'
import { CardItem } from '@/components/tribeca/CardItem'
import { LoadingSpinner } from '@/components/tribeca/LoadingSpinner'
import { TokenAmountDisplay } from '@/components/tribeca/TokenAmountDisplay'
import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useUserEscrow } from '@/hooks/tribeca/useEscrow'
import { useWrapTx } from '@/hooks/tribeca/useWrapTx'
import { makeDate } from '@/components/tribeca/proposals/ProposalIndexView/locked-voter/ProposalHistory'

interface YourLockupProps {
    className?: string
}

function YourLockup({ className }: YourLockupProps) {
    const { veToken } = useGovernor()
    const { data: escrow, veBalance } = useUserEscrow()
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    if (!escrow) {
        return null
    }

    const endDate = makeDate(escrow.escrow.escrowEndsAt)

    if (endDate <= new Date()) {
        return (
            <Card title="Your Lockup" className={className}>
                <div className="px-7 py-4 text-sm grid gap-4">
                    <p>
                        Your lockup has expired. You may now withdraw your locked tokens.
                    </p>
                    <div>
                        <Button
                            size="md"
                            variant="primary"
                            onClick={async () => {
                                const exitTX = await escrow.escrowW.exit()
                                const { pending, success } = await handleTX(
                                    await wrapTx(exitTX),
                                    'Exit Vote Escrow'
                                )
                                if (!success || !pending) {
                                    return
                                }
                                await pending.wait()
                            }}
                        >
                            Withdraw Tokens
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    const timeRemaining = formatDistance(endDate, new Date())

    return (
        <Card title="Your Lockup" className={className}>
            <div className="flex flex-row flex-wrap">
                <CardItem label={`${veToken?.symbol ?? 've'} Balance`}>
                    {veBalance ? (
                        <TokenAmountDisplay amount={veBalance} showSymbol={false} />
                    ) : (
                        <LoadingSpinner />
                    )}
                </CardItem>
                <CardItem label="Time Remaining">{timeRemaining}</CardItem>
                <CardItem label="End Date">{endDate.toLocaleDateString()}</CardItem>
            </div>
        </Card>
    )
}

export { YourLockup }