import { PublicKey } from '@solana/web3.js';
import { Explorer } from '@/types/saber';

interface ExplorerConfig {
    address: string;
    tx: string;
    name: string;
}

interface DisplayToken {
    address: string;
    chainId: number;
    decimals: number;
    extensions: Record<string, unknown>;
    logoURI: string;
    name: string;
    symbol: string;
    tags: string[];
}

interface RewardsToken {
    mint: string;
    decimals: number;
}

interface QuarryInfo {
    displayRewardsToken: DisplayToken;
    rewardsToken: RewardsToken;
}

export const explorers: Record<Explorer, ExplorerConfig> = {
    [Explorer.SOLSCAN]: {
        address: 'https://solscan.io/address/',
        tx: 'https://solscan.io/tx/',
        name: 'Solscan',
    },
};

/**
 * Quarry program addresses.
 */
export const QUARRY_ADDRESSES = {
    MergeMine: new PublicKey('QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto'),
    Mine: new PublicKey('QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB'),
    MintWrapper: new PublicKey('QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV'),
    Operator: new PublicKey('QoP6NfrQbaGnccXQrMLUkog2tQZ4C1RFgJcwDnT8Kmz'),
    Redeemer: new PublicKey('QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9'),
    Registry: new PublicKey('QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc'),
} as const;

export const saberQuarryInfo: QuarryInfo = {
    displayRewardsToken: {
        address: 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
        chainId: 103,
        decimals: 6,
        extensions: {},
        logoURI: 'https://registry.saber.so/token-icons/sbr.svg',
        name: 'Saber Protocol Token',
        symbol: 'SBR',
        tags: [],
    },
    rewardsToken: {
        mint: 'iouQcQBAiEXe6cKLS85zmZxUqaCqBdeHFpqKoSz615u',
        decimals: 6,
    },
};