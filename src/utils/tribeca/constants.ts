import { PublicKey } from '@solana/web3.js'

// Time constants
export const TX_REFETCH_TIME = 1_000

// RPC Endpoints
export const SYNDICA_RPC_ENDPOINT = `https://solana-api.syndica.io/access-token/${
    process.env.NEXT_PUBLIC_SYNDICA_ACCESS_TOKEN ?? 'TOKEN_NOT_FOUND'
}/rpc`

export const PROJECT_SERUM_RPC_ENDPOINT = 'https://solana-api.projectserum.com'
export const GENESYS_GO_RPC_ENDPOINT = 'https://ssc-dao.genesysgo.net'
export const API_BASE = 'https://api.saber.so/api/v1'

// Tags
export enum Tags {
    DecimalWrapped = 'saber-decimal-wrapped',
}
// DeployDAO Base URL
export const DEPLOYDAO_BASE_URL = 'https://raw.githubusercontent.com/DeployDAO/solana-program-index/master'

// Program and Key Constants
export const PROGRAM_KEYS = {
    BANK: new PublicKey('G6smmw1wU7UC4oZmdxWvXjhesJib9GvjwRbQQePV3U4L'),
    SABER_REWARDER: new PublicKey('rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk'),
    SABER_DAO_SMART_WALLET: new PublicKey('BkkBFsRm6VCbZyBG82yuHBnyjJwUJHv1nTJ3GiY44Tkr'),
    SABER_EMERGENCY_DAO: new PublicKey('ECq1pSyyTyRiD9SNY89uiW91ihq3XLRUN1NCdZzRyQXy'),
    SABER_EXECUTIVE_COUNCIL: new PublicKey('Hq1K3tCMzXVePh4ViNKA12PCcrtye3sqqLRWv79vb8hp'),
    MEMO: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    CHEST: new PublicKey('E9vP6o8Cn77GZqnbhQjagXjFChda9f4KtDsa9TrsB37t'),
} as const

// CASH Token Constants
export const CASH_MINT_STRING = 'CASHVDm2wsJXfhj6VWxb7GiMdoLc17Du7paH4bNr5woT'
export const CASH_MINT = new PublicKey(CASH_MINT_STRING)

// UI Constants
export const PROPOSAL_TITLE_MAX_LEN = 140
