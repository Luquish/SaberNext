'use client'

import { useTokenAmount, useTokenMint } from '@rockooor/sail'
import { mapN } from '@saberhq/solana-contrib'
import { TokenAmount } from '@saberhq/token-utils'

import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useVotersList } from '@/hooks/tribeca/useVotersList'

const numberFormatOptions = {
    maximumFractionDigits: 0,
}

export function OverviewHeader() {
    const { govToken, veToken, lockedSupply } = useGovernor()
    const { data: votersList } = useVotersList()
    const { data: govTokenData } = useTokenMint(govToken?.mintAccount)
    
    const totalSupplyFmt = mapN(
        (govTokenData, govToken) =>
            new TokenAmount(govToken, govTokenData.account.supply).format({
                numberFormatOptions,
            }),
        govTokenData,
        govToken
    )
    
    const lockedSupplyFmt = lockedSupply
        ? lockedSupply.format({
            numberFormatOptions,
        })
        : lockedSupply

    const totalVeTokens = useTokenAmount(veToken, votersList?.totalVotes ?? '0')

    const StatCard = 'div'
    const StatInner = 'div'

    return (
        <div className='flex flex-wrap gap-2.5'>
            <StatCard className='flex-grow basis-full md:basis-auto bg-transparent border border-[#595959] p-5 rounded'>
                <StatInner className='flex flex-col'>
                    <div className='h-7 flex items-center'>
                        {lockedSupplyFmt ? (
                            <span className='text-white text-xl font-semibold'>
                                {lockedSupplyFmt.toString()}
                            </span>
                        ) : (
                            <div className='flex animate-pulse bg-gray h-4 w-12 rounded' />
                        )}
                    </div>
                    <span className='text-white text-xs font-semibold tracking-tighter'>
                        {govToken?.symbol} Locked
                    </span>
                </StatInner>
            </StatCard>
            
            <StatCard className='flex-grow md:basis-[200px] md:flex-grow-0 bg-transparent border border-[#595959] p-5 rounded'>
                <StatInner className='flex flex-col'>
                    <div className='h-7 flex items-center'>
                        {totalVeTokens ? (
                            <span className='text-white text-xl font-semibold'>
                                {totalVeTokens.asNumber.toLocaleString(undefined, numberFormatOptions)}
                            </span>
                        ) : (
                            <div className='flex animate-pulse bg-gray h-4 w-12 rounded' />
                        )}
                    </div>
                    <span className='text-white text-xs font-semibold tracking-tighter'>
                        Total Supply of {veToken?.symbol}
                    </span>
                </StatInner>
            </StatCard>
            
            <StatCard className='flex-grow md:basis-[200px] md:flex-grow-0 bg-transparent border border-[#595959] p-5 rounded'>
                <StatInner className='flex flex-col'>
                    <div className='h-7 flex items-center'>
                        {totalSupplyFmt ? (
                            <span className='text-white text-xl font-semibold'>
                                {totalSupplyFmt}
                            </span>
                        ) : (
                            <div className='flex animate-pulse bg-gray h-4 w-12 rounded' />
                        )}
                    </div>
                    <span className='text-white text-xs font-semibold tracking-tighter'>
                        Total Supply of {govToken?.symbol}
                    </span>
                </StatInner>
            </StatCard>
        </div>
    )
}
