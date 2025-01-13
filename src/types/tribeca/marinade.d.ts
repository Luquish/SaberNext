declare module '@marinade.finance/escrow-relocker-helper' {
    import { Connection, PublicKey } from '@solana/web3.js'
    
    export class NftLockerHelperSDK {
        constructor(wallet: PublicKey, connection: Connection)
    }
}