export const APP_CONFIG = {
    name: 'Tribeca',
    title: 'Tribeca - Solana Governance By DAOs, For DAOs',
    fullName: 'Tribeca DAO Platform',
    description: 'Tribeca is a governance platform on Solana built by DAOs, for DAOs.',
    url: 'https://app.saberdao.io',
    image: 'https://tribeca.so/images/tribeca/og-image.png',
    imageAlt: 'A Solana-based governance platform built by DAOs, for DAOs.',
    socials: {
        twitter: 'TribecaDAO',
        medium: 'TribecaDAO',
        github: 'TribecaHQ',
        discord: 'cDvtZt886p',
    },
    favicon: '/public/tribeca/favicon.png',
    code: 'https://github.com/TribecaHQ/tribeca',
    docs: 'https://docs.tribeca.so',
    sentry: {
        dsn: 'https://ff672b53bedc4967a09c127da4a94064@o676708.ingest.sentry.io/6130116',
    },
    colors: {
        theme: '#282A2C',
    },
    gaID: 'G-3KJZR5HSRZ',
} as const

// Si necesitamos tipos, podemos inferirlos del objeto
export type AppConfig = typeof APP_CONFIG