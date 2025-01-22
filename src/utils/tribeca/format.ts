import { Fraction, Percent, ZERO } from '@saberhq/token-utils'
import { formatDuration, intervalToDuration } from 'date-fns'
import JSBI from 'jsbi'

import { CURRENCY_INFO, CurrencyMarket } from '@/utils/tribeca/currencies'

/**
 * Default date formatter
 */
export const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
})

/**
 * Default percent format options
 */
export const FORMAT_PERCENT: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
    style: 'percent',
}

/**
 * Vote percentage formatter
 */
export const FORMAT_VOTE_PERCENT = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    style: 'percent',
})

/**
 * Converts a Fraction to a floating point number
 */
export function fractionToFloat(frac: Fraction): number {
    if (JSBI.equal(frac.denominator, ZERO)) {
        return JSBI.greaterThan(frac.numerator, ZERO)
            ? Number.POSITIVE_INFINITY
            : JSBI.lessThan(frac.numerator, ZERO)
                ? Number.NEGATIVE_INFINITY
                : Number.NaN
    }
    return parseFloat(frac.toFixed(10))
}

const ONE_BP = new Percent(1, 10_000)

/**
 * Formats a percentage with appropriate precision
 */
export function formatPercent(percent: Percent): string {
    return percent.lessThan(ONE_BP)
        ? `${percent.toSignificant()}%`
        : fractionToFloat(percent.asFraction).toLocaleString(undefined, FORMAT_PERCENT)
}

/**
 * Formats a percentage with maximum precision
 */
export function formatPrecise(percent: Percent): string {
    return (fractionToFloat(percent.asFraction) * 100).toLocaleString(undefined, {
        maximumFractionDigits: 10,
    })
}

/**
 * Default USD format options
 */
export const FORMAT_DOLLARS: Intl.NumberFormatOptions = {
    currency: 'USD',
    style: 'currency',
}

/**
 * USD format options without decimals
 */
export const FORMAT_DOLLARS_WHOLE: Intl.NumberFormatOptions = {
    currency: 'USD',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
}

/**
 * Formats a currency amount with decimals
 */
export function formatCurrency(
    amount: number,
    currency: CurrencyMarket,
    numberFormatOptions: Intl.NumberFormatOptions = {}
): string {
    if (currency === CurrencyMarket.NONE) {
        return amount.toLocaleString(undefined, {
            minimumSignificantDigits: 4,
            ...numberFormatOptions,
        })
    }
    if (currency === CurrencyMarket.USD) {
        return amount.toLocaleString(undefined, {
            ...FORMAT_DOLLARS,
            ...numberFormatOptions,
        })
    }
    const fmt = amount.toLocaleString(undefined, {
        minimumSignificantDigits: 4,
        ...numberFormatOptions,
    })
    const info = CURRENCY_INFO[currency]
    return info.prefix ? `${info.prefix}${fmt}` : `${fmt} ${info.symbol}`
}

/**
 * Formats a currency amount without decimals
 */
export function formatCurrencyWhole(
    amount: number,
    currency: CurrencyMarket,
    numberFormatOptions: Intl.NumberFormatOptions = {}
): string {
    if (currency === CurrencyMarket.NONE) {
        return amount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            ...numberFormatOptions,
        })
    }
    if (currency === CurrencyMarket.USD) {
        return amount.toLocaleString(undefined, {
            ...FORMAT_DOLLARS_WHOLE,
            ...numberFormatOptions,
        })
    }
    const fmt = amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...numberFormatOptions,
    })
    const info = CURRENCY_INFO[currency]
    return info.prefix ? `${info.prefix}${fmt}` : `${fmt} ${info.symbol}`
}

/**
 * Smartly formats a currency amount based on its size
 */
export function formatCurrencySmart(
    amount: number | Fraction,
    currency: CurrencyMarket,
    numberFormatOptions?: Intl.NumberFormatOptions
): string {
    const amtFloat = amount instanceof Fraction || 
        (typeof amount === 'object' && (amount as Record<string, unknown>)?.toFixed)
        ? fractionToFloat(amount)
        : amount

    const threshold = currency === CurrencyMarket.USD || currency === CurrencyMarket.BTC
        ? 100
        : 1

    return amtFloat > threshold
        ? formatCurrencyWhole(amtFloat, currency, numberFormatOptions)
        : formatCurrency(amtFloat, currency, numberFormatOptions)
}

export function formatDisplayWithSoftLimit(
    float: number,
    maxDecimals: number,
    softMaximumSignificantDigits = 7,
    numberFormatOptions?: Intl.NumberFormatOptions,
    locale?: string
): string {
    if (
        Number.isNaN(softMaximumSignificantDigits) ||
        softMaximumSignificantDigits <= 0
    ) {
        throw new Error('softMaximumSignificantDigits must be greater than 0')
    }

    // Round to integer if there are enough whole digits
    const dropDecimalsAfter = Math.pow(10, softMaximumSignificantDigits - 1)

    if (float >= dropDecimalsAfter) {
        // Round down to display integer amount
        const wholeNumberFormatOptions: Intl.NumberFormatOptions = Object.assign(
            {},
            numberFormatOptions,
            {
                maximumFractionDigits: 0,
            }
        )
        return Math.floor(float).toLocaleString(locale, wholeNumberFormatOptions)
    }

    // Round to maxDecimals if too small
    const sigDerivedDigitsOnRight =
        softMaximumSignificantDigits - Math.floor(Math.log10(float)) - 1

    const digitsOnRight = Math.max(
        0,
        Math.min(maxDecimals, sigDerivedDigitsOnRight)
    )
    const flooredToPrecision =
        Math.floor(float * 10 ** digitsOnRight) / 10 ** digitsOnRight

    const maxFormatOptions: Intl.NumberFormatOptions = Object.assign(
        {
            minimumFractionDigits: digitsOnRight,
            maximumFractionDigits: digitsOnRight,
        },
        numberFormatOptions
    )
    return flooredToPrecision.toLocaleString(locale, maxFormatOptions)
}

/**
 * Formats a number with SI suffixes (k, m, b, t)
 */
export function formatNumberSI(value: number): string {
    const SI_SUFFIXES = {
        t: 12,
        b: 9,
        m: 6,
        k: 3,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = Object.entries(SI_SUFFIXES).find(([_, power]) => value >= 10 ** power)
    if (!result) {
        return value.toLocaleString()
    }

    const [suffix, power] = result
    const adjusted = value / 10 ** power
    return `${adjusted.toLocaleString(undefined, {
        maximumSignificantDigits: 3,
    })}${suffix}`
}

/**
 * Formats a duration in seconds to a human-readable string
 */
export function formatDurationSeconds(seconds: number): string {
    return formatDuration(
        intervalToDuration({
            start: new Date(0),
            end: new Date(seconds * 1_000),
        }),
        { delimiter: ', ' }
    )
}

/**
 * Formats the most significant parts of a duration between two dates
 */
export function formatSignificantDistance(end: Date, start: Date): string {
    return formatDuration(
        intervalToDuration({ start, end }),
        { delimiter: ', ' }
    )
        .split(', ')
        .slice(0, 3)
        .join(', ')
}

/**
 * Formats a significant distance with before/after suffix
 */
export function formatSignificantDistanceWithSuffix(end: Date, start: Date): string {
    const fmt = formatSignificantDistance(end, start)
    return `${fmt} ${end < start ? 'after' : 'before'}`
}