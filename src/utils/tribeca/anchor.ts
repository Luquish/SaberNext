import { QUARRY_ADDRESSES } from '@quarryprotocol/quarry-sdk'
import { TOKEN_PROGRAM_ID } from '@saberhq/token-utils'
import {
    PublicKey,
    SystemProgram,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    SYSVAR_STAKE_HISTORY_PUBKEY,
} from '@solana/web3.js'

/**
 * Common Solana program accounts used across Tribeca
 */
interface CommonAccounts {
    systemProgram: PublicKey
    tokenProgram: PublicKey
    clock: PublicKey
    unusedClock: PublicKey
    rent: PublicKey
    stakeHistory: PublicKey
    quarryMineProgram: PublicKey
    mineProgram: PublicKey
    mintWrapperProgram: PublicKey
}

/**
 * Common program accounts used in Tribeca operations
 * @readonly
 */
export const COMMON_ACCOUNTS: Readonly<CommonAccounts> = {
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: SYSVAR_CLOCK_PUBKEY,
    unusedClock: SYSVAR_CLOCK_PUBKEY,
    rent: SYSVAR_RENT_PUBKEY,
    stakeHistory: SYSVAR_STAKE_HISTORY_PUBKEY,
    quarryMineProgram: QUARRY_ADDRESSES.Mine,
    mineProgram: QUARRY_ADDRESSES.Mine,
    mintWrapperProgram: QUARRY_ADDRESSES.MintWrapper,
}

// Re-export for convenience
export type { CommonAccounts }