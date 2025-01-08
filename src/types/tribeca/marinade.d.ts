declare module '@marinade.finance/escrow-relocker-sdk' {
    import { Provider } from '@saberhq/solana-contrib'
    
    export class EscrowRelockerSDK {
        constructor({ provider }: { provider: Provider })
    }
}

declare module '@marinade.finance/escrow-relocker-helper' {
    import { Connection, PublicKey } from '@solana/web3.js'
    
    export class NftLockerHelperSDK {
        constructor(wallet: PublicKey, connection: Connection)
    }
}