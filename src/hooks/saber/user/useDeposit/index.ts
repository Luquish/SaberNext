'use client'

import { type TransactionInstruction } from '@solana/web3.js'
import { type PublicKey, Keypair } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SABER_CODERS, WrappedTokenActions } from '@saberhq/saber-periphery'
import { type TransactionEnvelope } from '@saberhq/solana-contrib'
import { 
    type IExchangeInfo, 
    StableSwap,
    calculateEstimatedMintAmount,
    calculateVirtualPrice, 
} from '@saberhq/stableswap-sdk'
import {
    Fraction,
    getOrCreateATAs,
    NATIVE_MINT,
    Percent,
    TokenAmount,
    ZERO,
} from '@saberhq/token-utils'
import { useCallback, useMemo } from 'react'
import invariant from 'tiny-invariant'

import { type PoolData } from '@/types/saber'
import { useStableSwapTokens } from '../../useStableSwapTokens'
import useSettings from '../../useSettings'
import useProvider from '../../useProvider'
import { calculateDepositSlippage } from './calculateDepositSlippage'
import { createEphemeralWrappedSolAccount } from '@/utils/saber/wrappedSol'
import { executeMultipleTxs } from '@/utils/saber/transaction'

interface DepositProps {
    tokenAmounts: readonly TokenAmount[]
    pool: PoolData
}

interface DepositResult {
    handleDeposit: (noStake: boolean) => Promise<void>
    depositDisabledReason?: string
    priceImpact: Percent | null
    estimatedDepositSlippage: Percent | null
    estimatedMint: ReturnType<typeof calculateEstimatedMintAmount> | null
}

interface PoolMints {
    lp: PublicKey
    tokenA: PublicKey
    tokenB: PublicKey
}

function calculateMinimumPoolTokenAmount(
    exchangeInfo: IExchangeInfo,
    amountA: TokenAmount,
    amountB: TokenAmount,
    maxSlippagePercent: Percent
): TokenAmount {
    const minimumPoolTokenAmount = new TokenAmount(exchangeInfo.lpTotalSupply.token, 0)
    
    try {
        const estimatedMint = calculateEstimatedMintAmount(
            exchangeInfo,
            amountA.raw,
            amountB.raw
        )
        return estimatedMint.mintAmount.reduceBy(maxSlippagePercent)
    } catch (e) {
        console.warn('Error calculating minimum pool token amount:', e)
        return minimumPoolTokenAmount
    }
}

export function useDeposit({ 
    tokenAmounts, 
    pool, 
}: DepositProps): DepositResult {
    const { wallet } = useWallet()
    const { saber } = useProvider()
    const { connection } = useConnection()
    const ssTokens = useStableSwapTokens(pool)
    const { maxSlippagePercent } = useSettings()

    // Initialize StableSwap instance
    const swap = useMemo(() => 
        new StableSwap(pool.info.swap.config, pool.info.swap.state),
    [pool.info.swap.config, pool.info.swap.state]
    )

    // Wrap token amounts
    const tokenAmountsWrapped = useMemo(() => 
        tokenAmounts.map((amount, i) => 
            ssTokens?.wrappedTokens[i]?.wrappedAmount(amount) ?? amount
        ),
    [tokenAmounts, ssTokens]
    )

    // Calculate estimated mint amount
    const estimatedMint = useMemo(() => {
        if (!pool.exchangeInfo) return null

        const [amountA, amountB] = tokenAmountsWrapped
        try {
            return calculateEstimatedMintAmount(
                pool.exchangeInfo,
                amountA?.raw ?? ZERO,
                amountB?.raw ?? ZERO
            )
        } catch (e) {
            console.warn('Ignoring mint estimation calculation error:', e)
            return null
        }
    }, [pool.exchangeInfo, tokenAmountsWrapped])

    // Calculate price impact
    const priceImpact = useMemo(() => {
        if (!pool.exchangeInfo || !estimatedMint) return null

        const totalTokens = tokenAmountsWrapped.reduce(
            (acc, amt) => acc.add(amt.asFraction),
            new Fraction(0)
        )
        
        if (totalTokens.isZero()) return new Percent(0)

        const virtualPrice = calculateVirtualPrice(pool.exchangeInfo)
        const expectedMint = virtualPrice
            ? totalTokens.divide(virtualPrice)
            : new Fraction(0)

        return new Percent(1).subtract(
            estimatedMint.mintAmount.asFraction.divide(expectedMint)
        )
    }, [estimatedMint, pool.exchangeInfo, tokenAmountsWrapped])

    // Calculate estimated deposit slippage
    const estimatedDepositSlippage = useMemo(() => {
        if (!pool.exchangeInfo) return null

        const [amountA, amountB] = tokenAmountsWrapped
        return calculateDepositSlippage(
            pool.exchangeInfo,
            amountA?.raw ?? ZERO,
            amountB?.raw ?? ZERO
        )
    }, [pool.exchangeInfo, tokenAmountsWrapped])

    // Determine if deposit is disabled
    const depositDisabledReason = useMemo(() => {
        if (!swap) return 'Loading...'
        if (!wallet) return 'Connect wallet'
        if (swap.state.isPaused) return 'Pool is paused'
        if (tokenAmounts.every(amount => amount.isZero()) || tokenAmounts.length === 0) {
            return 'Enter an amount'
        }
        if (estimatedDepositSlippage?.greaterThan(maxSlippagePercent)) {
            return 'Price impact too high'
        }
        return undefined
    }, [swap, wallet, tokenAmounts, estimatedDepositSlippage, maxSlippagePercent])

    // Handle SOL deposits
    const handleSolDeposit = useCallback(async (
        swap: StableSwap,
        exchangeInfo: IExchangeInfo,
        mints: PoolMints,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        noStake: boolean
    ): Promise<void> => {
        const allInstructions: TransactionInstruction[] = []
        
        // Create Associated Token Accounts if they don't exist
        const result = await getOrCreateATAs({
            provider: saber.provider,
            mints,
        })

        // Add ATA creation instructions if needed
        Object.values(result.createAccountInstructions).forEach(instruction => {
            if (instruction) allInstructions.push(instruction)
        })

        const [amountA, amountB] = tokenAmountsWrapped
        const [amountAInput, amountBInput] = tokenAmounts

        invariant(amountA && amountB, 'Amounts missing')
        invariant(amountAInput && amountBInput, 'Input amounts missing')
        invariant(wallet?.adapter.publicKey, 'Wallet not connected')

        // Create and setup ephemeral SOL account
        const ephemeralAccount = Keypair.generate()
        const { init, accountKey, close } = await createEphemeralWrappedSolAccount({
            provider: saber.provider,
            amount: mints.tokenA.equals(NATIVE_MINT) ? amountA : amountB,
            accountKP: ephemeralAccount,
        })
        allInstructions.push(...init.instructions)

        // Calculate minimum pool tokens to receive
        const minimumPoolTokenAmount = calculateMinimumPoolTokenAmount(
            exchangeInfo,
            amountA,
            amountB,
            maxSlippagePercent
        )

        invariant(estimatedMint, 'Estimated mint amount is null')

        // Add deposit instruction
        allInstructions.push(
            swap.deposit({
                userAuthority: saber.provider.wallet.publicKey,
                sourceA: mints.tokenA.equals(NATIVE_MINT) 
                    ? accountKey 
                    : result.accounts.tokenA,
                sourceB: mints.tokenB.equals(NATIVE_MINT) 
                    ? accountKey 
                    : result.accounts.tokenB,
                poolTokenAccount: result.accounts.lp,
                tokenAmountA: amountA.toU64(),
                tokenAmountB: amountB.toU64(),
                minimumPoolTokenAmount: minimumPoolTokenAmount.toU64(),
            })
        )

        // Close ephemeral SOL account
        allInstructions.push(...close.instructions)

        // Create and execute transaction
        const txEnv: TransactionEnvelope = saber.newTx(
            allInstructions, 
            [ephemeralAccount]
        )

        await executeMultipleTxs(
            connection,
            [{
                txs: txEnv.instructions,
                signers: [ephemeralAccount],
                description: 'Deposit',
            }],
            wallet
        )
    }, [
        maxSlippagePercent,
        tokenAmounts,
        tokenAmountsWrapped,
        connection,
        wallet,
        saber,
        estimatedMint,
    ])

    // Handle regular token deposits
    const handleDeposit = useCallback(async (noStake: boolean): Promise<void> => {
        if (!swap || !pool.exchangeInfo) {
            throw new Error('Swap or exchange info is null')
        }
        invariant(saber, 'Provider is required')

        const mints: PoolMints = {
            lp: pool.exchangeInfo.lpTotalSupply.token.mintAccount,
            tokenA: pool.exchangeInfo.reserves[0].amount.token.mintAccount,
            tokenB: pool.exchangeInfo.reserves[1].amount.token.mintAccount,
        }

        // Handle SOL deposits separately
        if (mints.tokenA.equals(NATIVE_MINT) || mints.tokenB.equals(NATIVE_MINT)) {
            return handleSolDeposit(swap, pool.exchangeInfo, mints, noStake)
        }

        const allInstructions: TransactionInstruction[] = []
        
        // Create pool token account if needed
        const result = await getOrCreateATAs({
            provider: saber.provider,
            mints,
        })

        if (result.createAccountInstructions.lp) {
            allInstructions.push(result.createAccountInstructions.lp)
        }

        const [amountA, amountB] = tokenAmountsWrapped
        const [amountAInput, amountBInput] = tokenAmounts

        invariant(amountA && amountB, 'Amounts missing')
        invariant(wallet?.adapter.publicKey, 'Wallet not connected')
        invariant(amountAInput && amountBInput, 'Input amounts missing')

        // Handle token A wrapping if needed
        if (!amountA.isZero() && !amountA.token.equals(amountAInput.token)) {
            const aWrapped = await WrappedTokenActions.loadWithActions(
                saber.provider,
                SABER_CODERS.AddDecimals.getProgram(saber.provider),
                amountAInput.token,
                amountA.token.decimals,
            )
            const doWrap = await aWrapped.wrap(amountAInput)
            allInstructions.push(...doWrap.instructions)
        } else if (result.createAccountInstructions.tokenA) {
            allInstructions.push(result.createAccountInstructions.tokenA)
        }

        // Handle token B wrapping if needed
        if (!amountB.isZero() && !amountB.token.equals(amountBInput.token)) {
            const bWrapped = await WrappedTokenActions.loadWithActions(
                saber.provider,
                SABER_CODERS.AddDecimals.getProgram(saber.provider),
                amountBInput.token,
                amountB.token.decimals,
            )
            const doWrap = await bWrapped.wrap(amountBInput)
            allInstructions.push(...doWrap.instructions)
        } else if (result.createAccountInstructions.tokenB) {
            allInstructions.push(result.createAccountInstructions.tokenB)
        }

        // Calculate minimum pool tokens to receive
        const minimumPoolTokenAmount = calculateMinimumPoolTokenAmount(
            pool.exchangeInfo,
            amountA,
            amountB,
            maxSlippagePercent
        )

        invariant(estimatedMint, 'Estimated mint amount is null')

        // Add deposit instruction
        allInstructions.push(
            swap.deposit({
                userAuthority: saber.provider.wallet.publicKey,
                sourceA: result.accounts.tokenA,
                sourceB: result.accounts.tokenB,
                poolTokenAccount: result.accounts.lp,
                tokenAmountA: amountA.toU64(),
                tokenAmountB: amountB.toU64(),
                minimumPoolTokenAmount: minimumPoolTokenAmount.toU64(),
            })
        )

        // Create and execute transaction
        const txEnv: TransactionEnvelope = saber.newTx(allInstructions)

        await executeMultipleTxs(
            connection,
            [{
                txs: txEnv.instructions,
                description: 'Deposit',
            }],
            wallet
        )
    }, [
        pool.exchangeInfo,
        handleSolDeposit,
        maxSlippagePercent,
        swap,
        tokenAmounts,
        tokenAmountsWrapped,
        connection,
        wallet,
        saber,
        estimatedMint,
    ])

    return {
        handleDeposit,
        depositDisabledReason,
        priceImpact,
        estimatedMint,
        estimatedDepositSlippage,
    }
}