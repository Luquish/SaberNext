export type IEnvironment = Readonly<{
    name: string;
    endpoint: string;
}>;

const ENDPOINTS: Record<string, string> = {
    'tribeca.so': 'https://saber-solanam-77b6.mainnet.rpcpool.com',
};

export const environments = {
    'mainnet-beta': {
        name: 'Mainnet Beta',
        endpoint: typeof window !== 'undefined'
            ? ENDPOINTS[window.location.hostname] ?? process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.mainnet-beta.solana.com'
            : process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.mainnet-beta.solana.com',
    },
    devnet: {
        name: 'Devnet',
        endpoint: 'https://api.devnet.solana.com',
    },
    testnet: {
        name: 'Testnet',
        endpoint: 'https://api.testnet.solana.com',
    },
    localnet: {
        name: 'Localnet',
        endpoint: 'http://localhost:3000',
    },
} as const;