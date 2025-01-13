import type { GOKI_ADDRESSES } from '@gokiprotocol/client';
import { GokiSDK } from '@gokiprotocol/client';
import { NftLockerHelperSDK } from '@marinade.finance/escrow-relocker-helper';
import { EscrowRelockerSDK } from '@marinade.finance/escrow-relocker-sdk';
import { useNativeAccount } from '@rockooor/sail';
import { SignerWallet, SolanaProvider } from '@saberhq/solana-contrib';
import type { TokenAmount } from '@saberhq/token-utils';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import type { PublicKey } from '@solana/web3.js';
import { Connection, Keypair } from '@solana/web3.js';
import { TribecaSDK } from '@tribecahq/tribeca-sdk';
import { useMemo } from 'react';
import { createContainer } from 'unstated-next';

// TODO: spoof origins
const MAINNET_CONNECTIONS = [
    'https://ssc-dao.genesysgo.net/',
    'https://solana-api.projectserum.com',
    'https://api.mainnet-beta.solana.com/',
].map((url) => new Connection(url));

export type ProgramKey = keyof typeof GOKI_ADDRESSES;

export function useSDKInternal(): {
    sdk: GokiSDK;
    sdkMut: GokiSDK | null;
    owner: PublicKey | null;
    nativeBalance?: TokenAmount;
    tribecaMut: TribecaSDK | null;
    marinadeMut: EscrowRelockerSDK;
    nftHelperSdk: NftLockerHelperSDK | null;
    } {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const { sdk: sdk } = useMemo(() => {
        const provider = SolanaProvider.init({
            connection,
            broadcastConnections: [...MAINNET_CONNECTIONS, connection],
            wallet: new SignerWallet(Keypair.generate()),
            opts: {
                commitment: 'confirmed',
            },
        });
        return {
            sdk: GokiSDK.load({ provider }),
        };
    }, [connection]);

    const { sdkMut } = useMemo(() => {
        if (!wallet) {
            return { sdkMut: null };
        }
        const provider = SolanaProvider.init({
            connection,
            broadcastConnections: [...MAINNET_CONNECTIONS, connection],
            wallet,
            opts: {
                commitment: 'confirmed',
            },
        });
        return {
            sdkMut: GokiSDK.load({ provider }),
        };
    }, [connection, wallet]);

    const tribecaMut = useMemo(() => {
        if (!wallet) {
            return null;
        }
        const provider = SolanaProvider.load({
            connection,
            sendConnection: connection,
            wallet,
            opts: {
                commitment: 'recent',
            },
        });
        return TribecaSDK.load({ provider });
    }, [connection, wallet]);

    const marinadeMut = useMemo(() => {
        const provider = SolanaProvider.init({
            connection,
            wallet: wallet ?? new SignerWallet(Keypair.generate()),
            opts: {
                commitment: 'recent',
            },
        });
        return new EscrowRelockerSDK({ provider });
    }, [connection, wallet]);

    const nftHelperSdk = useMemo(() => {
        if (!wallet) {
            return null;
        }
        return new NftLockerHelperSDK(wallet.publicKey, connection);
    }, [connection, wallet]);

    const owner = useMemo(
        () => sdkMut?.provider.wallet.publicKey ?? null,
        [sdkMut?.provider.wallet.publicKey]
    );
    const { nativeBalance } = useNativeAccount();

    return {
        owner,
        nativeBalance,
        sdk,
        sdkMut: sdkMut ?? null,
        tribecaMut,
        marinadeMut,
        nftHelperSdk,
    };
}

export const { useContainer: useSDK, Provider: SDKProvider } =
  createContainer(useSDKInternal);
