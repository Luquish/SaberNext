import type { IExchangeInfo } from '@saberhq/stableswap-sdk';
import { calculateEstimatedWithdrawOneAmount } from '@saberhq/stableswap-sdk';
import type { Fraction, Token } from '@saberhq/token-utils';
import { Percent, TokenAmount, ZERO } from '@saberhq/token-utils';
import JSBI from 'jsbi';

import type { WithdrawCalculationResult } from '.';
import type { WrappedToken } from '@/types/saber/tokens/wrappedToken';

interface CalculateWithdrawOneParams {
    exchangeInfo: IExchangeInfo;
    poolTokenAmount: TokenAmount;
    withdrawToken: WrappedToken;
    virtualPrice: Fraction;
    maxSlippagePercent: Percent;
}

/**
 * Calculates the expected withdrawal amount for a single token
 */
function calculateExpectedWithdrawOneAmount(
    virtualPrice: Fraction,
    tokens: [Token, Token],
    withdrawPoolTokenAmount: TokenAmount
): [TokenAmount, TokenAmount] {
    const lpTokenValue = virtualPrice.multiply(withdrawPoolTokenAmount.raw);
    const fixedValue = lpTokenValue.toFixed(0);
    
    return [
        new TokenAmount(tokens[0], fixedValue),
        new TokenAmount(tokens[1], fixedValue),
    ];
}

/**
 * Calculates parameters for withdrawing a single token from the pool
 */
export function calculateWithdrawOne({
    exchangeInfo,
    poolTokenAmount,
    withdrawToken,
    virtualPrice,
    maxSlippagePercent,
}: CalculateWithdrawOneParams): WithdrawCalculationResult {
    const tokens = exchangeInfo.reserves.map(r => r.amount.token) as [Token, Token];
    const withdrawTokenValue = withdrawToken.value;

    // Calculate withdrawal amounts and fees
    const withdrawOneAmount = calculateEstimatedWithdrawOneAmount({
        exchange: exchangeInfo,
        poolTokenAmount,
        withdrawToken: withdrawTokenValue,
    });

    // Calculate total fee if withdrawal amount exists
    const totalFee = withdrawOneAmount && new TokenAmount(
        withdrawTokenValue,
        JSBI.add(
            withdrawOneAmount.swapFee.raw,
            withdrawOneAmount.withdrawFee.raw
        )
    );

    const renderedFee = totalFee && !totalFee.isZero() ? totalFee : undefined;

    // Calculate token amounts and fees
    const tokenCalcs = tokens.map(tok => 
        tok.equals(withdrawTokenValue)
            ? [withdrawOneAmount?.withdrawAmount, renderedFee]
            : [undefined, undefined]
    );

    const estimates = tokenCalcs.map(c => c[0]) as [
        TokenAmount | undefined,
        TokenAmount | undefined
    ];
    
    const fees = tokenCalcs.map(c => c[1]) as [
        TokenAmount | undefined,
        TokenAmount | undefined
    ];

    // Calculate expected amounts
    const expected = calculateExpectedWithdrawOneAmount(
        virtualPrice,
        tokens,
        poolTokenAmount
    );

    // Calculate minimum amounts considering slippage
    const minimums = tokens.map((tok, i) => 
        expected[i]?.reduceBy(maxSlippagePercent) ?? new TokenAmount(tok, ZERO)
    ) as [TokenAmount | undefined, TokenAmount | undefined];

    // Calculate slippage percentages
    const slippages = estimates.map((estimate, i) => {
        const estimateRaw = estimate?.raw;
        const expectedRaw = expected[i]?.raw;
        if (!estimateRaw || !expectedRaw) return undefined;
        return new Percent(JSBI.subtract(expectedRaw, estimateRaw), expectedRaw);
    }) as [Percent | undefined, Percent | undefined];

    // Calculate fee percentages
    const feePercents = fees.map((fee, i) => {
        const estimate = estimates[i];
        return fee && estimate && !estimate.isZero()
            ? fee.divideBy(estimate)
            : undefined;
    }) as [Percent | undefined, Percent | undefined];

    return {
        estimates,
        fees,
        feePercents,
        minimums,
        slippages,
    };
}
