import type { IExchangeInfo } from '@saberhq/stableswap-sdk';
import { calculateVirtualPrice } from '@saberhq/stableswap-sdk';
import { Percent, ZERO } from '@saberhq/token-utils';
import JSBI from 'jsbi';
import invariant from 'tiny-invariant';
import { calculateLPTokenAmount } from '@/utils/saber/calculateLPTokenAmount';

/**
 * Calculates the deposit slippage for providing liquidity
 * Formula based on Curve's implementation
 * @param exchange Exchange info containing pool data
 * @param amountA First token amount
 * @param amountB Second token amount
 * @returns Slippage as a Percent
 */
export const calculateDepositSlippage = (
    exchange: IExchangeInfo,
    amountA: JSBI,
    amountB: JSBI,
): Percent => {
    // Validate inputs
    invariant(exchange, 'Exchange info is required');
    invariant(JSBI.greaterThanOrEqual(amountA, ZERO), 'Amount A must be non-negative');
    invariant(JSBI.greaterThanOrEqual(amountB, ZERO), 'Amount B must be non-negative');

    // Calculate constant sum (Sr)
    const constantSum = JSBI.add(amountA, amountB);
    if (JSBI.equal(constantSum, ZERO)) {
        return new Percent(0);
    }

    // Calculate expected LP tokens
    const tokenAmount = calculateLPTokenAmount(exchange, amountA, amountB, true);
    
    // Get virtual price
    const virtualPrice = calculateVirtualPrice(exchange);
    if (!virtualPrice) {
        return new Percent(0);
    }

    // Calculate slippage: 1 - (virtualPrice * tokenAmount / constantSum)
    return new Percent(1).subtract(
        new Percent(virtualPrice.multiply(tokenAmount).quotient, constantSum),
    );
};
