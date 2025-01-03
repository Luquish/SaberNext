import type { IExchangeInfo } from '@saberhq/stableswap-sdk';
import { calculateEstimatedWithdrawAmount } from '@saberhq/stableswap-sdk';
import type { TokenAmount } from '@saberhq/token-utils';
import { Percent } from '@saberhq/token-utils';

import type { WithdrawCalculationResult } from '.';

interface CalculateWithdrawAllParams {
    poolTokenAmount: TokenAmount;
    exchangeInfo: IExchangeInfo;
    maxSlippagePercent: Percent;
}

/**
 * Calculates withdrawal amounts and related metrics for removing all liquidity
 * @param params Parameters for withdrawal calculation
 * @returns Withdrawal calculation results including estimates, fees, and minimums
 */
export function calculateWithdrawAll({
    poolTokenAmount,
    exchangeInfo,
    maxSlippagePercent,
}: CalculateWithdrawAllParams): WithdrawCalculationResult {
    const result = calculateEstimatedWithdrawAmount({
        poolTokenAmount,
        reserves: exchangeInfo.reserves,
        fees: exchangeInfo.fees,
        lpTotalSupply: exchangeInfo.lpTotalSupply,
    });

    // Calculate minimum amounts to receive considering slippage
    const minimums = result.withdrawAmounts.map(amount =>
        amount?.reduceBy(maxSlippagePercent)
    ) as [TokenAmount | undefined, TokenAmount | undefined]

    return {
        estimates: result.withdrawAmounts,
        fees: result.fees,
        // Calculate fee percentages for each token
        feePercents: [
            result.fees[0].divideBy(result.withdrawAmountsBeforeFees[0]),
            result.fees[1].divideBy(result.withdrawAmountsBeforeFees[1]),
        ] as const,
        minimums,
        slippages: [new Percent(0, 1), new Percent(0, 1)] as const,
    }
}
