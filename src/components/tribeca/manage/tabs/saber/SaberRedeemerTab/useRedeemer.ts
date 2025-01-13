import {
    findRedeemerKey,
    SABER_IOU_MINT,
    SBR_ADDRESS,
} from '@saberhq/saber-periphery'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'

import { useSaberRedeemerData } from '@/utils/tribeca/parsers'

/**
 * Hook to fetch and manage Saber redeemer data
 * @param iouMint - The IOU mint public key (defaults to SABER_IOU_MINT)
 * @returns The redeemer data for the given IOU mint
 */
export function useRedeemer(iouMint: PublicKey = SABER_IOU_MINT) {
    const { data: redeemerKey } = useQuery({
        queryKey: ['saberRedeemerKey', iouMint.toString()],
        queryFn: async () => {
            const [redeemerKey] = await findRedeemerKey({
                iouMint,
                redemptionMint: SBR_ADDRESS,
            })
            return redeemerKey
        },
    })

    return useSaberRedeemerData(redeemerKey)
}