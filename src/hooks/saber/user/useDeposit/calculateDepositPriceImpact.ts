import type { IExchangeInfo } from '@saberhq/stableswap-sdk';
import { calculateEstimatedMintAmount } from '@saberhq/stableswap-sdk';
import type { Fraction } from '@saberhq/token-utils';
import { Percent, TokenAmount, ZERO } from '@saberhq/token-utils';
import JSBI from 'jsbi';
import invariant from 'tiny-invariant';

/**
 * Calculates the price per LP token based on reserves and total supply
 * @param exchange Exchange info containing pool data
 * @returns Price per LP token as a Fraction
 */
const calculatePricePerLPToken = (exchange: IExchangeInfo): Fraction => {
    invariant(exchange.reserves.length === 2, 'Exchange must have exactly 2 reserves');
    invariant(!exchange.lpTotalSupply.isZero(), 'LP total supply cannot be zero');

    return exchange.reserves[0].amount.asFraction
        .add(exchange.reserves[1].amount.asFraction)
        .divide(exchange.lpTotalSupply.asFraction);
};

/**
 * Calculates the price impact of a deposit by comparing LP token price before and after
 * @param exchange Exchange info containing pool data
 * @param amountA First token amount to deposit
 * @param amountB Second token amount to deposit
 * @returns Price impact as a Percent
 */
export const calculateDepositPriceImpact = (
    exchange: IExchangeInfo,
    amountA: JSBI,
    amountB: JSBI,
): Percent => {
    // Validate inputs
    invariant(exchange, 'Exchange info is required');
    invariant(JSBI.greaterThanOrEqual(amountA, ZERO), 'Amount A must be non-negative');
    invariant(JSBI.greaterThanOrEqual(amountB, ZERO), 'Amount B must be non-negative');

    const constantSum = JSBI.add(amountA, amountB);
    if (JSBI.equal(constantSum, ZERO)) {
        return new Percent(0);
    }

    // Calculate new LP tokens to be minted
    const { mintAmount } = calculateEstimatedMintAmount(
        exchange,
        amountA,
        amountB,
    );

    // Calculate new state after deposit
    const newLpTotalSupply = exchange.lpTotalSupply.add(
        new TokenAmount(exchange.lpTotalSupply.token, mintAmount.raw),
    );
    const exchangeAfterDeposit = {
        ...exchange,
        lpTotalSupply: newLpTotalSupply,
        reserves: [
            {
                ...exchange.reserves[0],
                amount: new TokenAmount(
                    exchange.reserves[0].amount.token,
                    JSBI.add(exchange.reserves[0].amount.raw, amountA),
                ),
            },
            {
                ...exchange.reserves[1],
                amount: new TokenAmount(
                    exchange.reserves[1].amount.token,
                    JSBI.add(exchange.reserves[1].amount.raw, amountB),
                ),
            },
        ] as const,
    };

    // Calculate price impact
    const lpPrice0 = calculatePricePerLPToken(exchange);
    const lpPrice1 = calculatePricePerLPToken(exchangeAfterDeposit);
    if (!lpPrice0 || !lpPrice1) {
        return new Percent(0);
    }

    // Use weighted average price for more accurate price impact calculation
    const fraction = lpPrice1
        .subtract(lpPrice0)
        .divide(lpPrice0.add(lpPrice1).divide(2));
    const percent = new Percent(fraction.numerator, fraction.denominator);

    // Return absolute value of price impact
    return percent.lessThan(0) ? percent.multiply(-1) : percent;
};
