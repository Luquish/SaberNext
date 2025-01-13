import type { Token } from '@saberhq/token-utils'
import { mapValues } from 'lodash-es'

/**
 * Available currency markets
 */
export enum CurrencyMarket {
    USD = 'USD',
    BTC = 'BTC',
    LUNA = 'LUNA',
    FTT = 'FTT',
    SRM = 'SRM',
    SOL = 'SOL',
}

/**
 * Currency market information type
 */
interface CurrencyInfo {
    name: string
    symbol: string
    prefix?: string
    largeFormat: Intl.NumberFormat
}

/**
 * Generates a market tag from a currency market
 */
export const getMarketTag = (market: CurrencyMarket): string =>
    `saber-market-${market.toString().toLowerCase()}`

/**
 * Map of currency markets to their tags
 */
export const CURRENCY_MARKET_TAGS: Record<CurrencyMarket, string> =
    mapValues(CurrencyMarket, getMarketTag)

/**
 * Gets a currency market from a tag
 */
export const getMarketFromTag = (tag: string): CurrencyMarket | null => {
    return (
        (Object.entries(CURRENCY_MARKET_TAGS).find(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, v]) => v === tag
        )?.[0] as CurrencyMarket) ?? null
    )
}

/**
 * Gets the market for a token, defaulting to USD
 */
export const getMarket = (token: Token): CurrencyMarket => {
    const marketTag = token.info.tags?.find((tag) =>
        tag.startsWith('saber-market-')
    )
    if (!marketTag) {
        return CurrencyMarket.USD
    }
    return getMarketFromTag(marketTag) ?? CurrencyMarket.USD
}

/**
 * Gets the market for a token if it exists
 */
export const getMarketIfExists = (token: Token): CurrencyMarket | null => {
    const marketTag = token.info.tags?.find((tag) =>
        tag.startsWith('saber-market-')
    )
    if (!marketTag) {
        return null
    }
    return getMarketFromTag(marketTag)
}

/**
 * Default options for formatting currencies in large amounts
 */
export const CURRENCY_INFO: Record<CurrencyMarket, CurrencyInfo> = {
    USD: {
        name: 'Stablecoin',
        symbol: 'USD',
        prefix: '%',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 0,
        }),
    },
    BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        prefix: '₿',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 8,
        }),
    },
    LUNA: {
        name: 'Luna',
        symbol: 'LUNA',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 2,
        }),
    },
    FTT: {
        name: 'FTT',
        symbol: 'FTT',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 4,
        }),
    },
    SRM: {
        name: 'SRM',
        symbol: 'SRM',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 3,
        }),
    },
    SOL: {
        name: 'SOL',
        symbol: 'SOL',
        largeFormat: new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 3,
        }),
    },
} as const