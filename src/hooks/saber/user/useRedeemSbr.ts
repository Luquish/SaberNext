import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getOrCreateATAs } from '@saberhq/token-utils';
import { PublicKey } from '@solana/web3.js';

import useProvider from '../useProvider';
import { SABER_IOU_MINT, SBR_MINT } from '@saberhq/saber-periphery';
import { executeMultipleTxs } from '@/utils/saber/transaction';

export function useRedeemSbr() {
    const { connection } = useConnection();
    const { saber } = useProvider();
    const { wallet } = useWallet();

    const redeem = async () => {
        if (!wallet?.adapter.publicKey) {
            return;
        }

        const redeemer = await saber.loadRedeemer({
            iouMint: SABER_IOU_MINT,
            redemptionMint: new PublicKey(SBR_MINT),
        });
    
        const { accounts, instructions } = await getOrCreateATAs({
            provider: saber.provider,
            mints: {
                iou: redeemer.data.iouMint,
                redemption: redeemer.data.redemptionMint,
            },
            owner: wallet.adapter.publicKey,
        });
    
        const redeemTx = await redeemer.redeemAllTokensFromMintProxyIx({
            iouSource: accounts.iou,
            redemptionDestination: accounts.redemption,
            sourceAuthority: wallet.adapter.publicKey,
        });
        
        await executeMultipleTxs(connection, [{
            txs: [...instructions, redeemTx],
            description: 'Redeem SOL',
        }], wallet);
    };

    return { redeem };
}