import type { Network } from '@saberhq/solana-contrib'
import { Connection } from '@solana/web3.js'

import { GENESYS_GO_RPC_ENDPOINT } from './constants'

/**
 * Default Solana devnet endpoint
 */
const DEVNET_ENDPOINT = 'https://api.devnet.solana.com'

interface GPAConnectionOptions {
    /**
     * Optional existing connection instance
     */
    connection?: Connection
    /**
     * Network to connect to
     */
    network?: Network
}

/**
 * Gets a connection instance for GetProgramAccounts (GPA) operations
 * Uses GenesysGo for mainnet and existing connection or devnet for other networks
 */
export function getGPAConnection({
    connection,
    network,
}: GPAConnectionOptions): Connection {
    // If no connection provided, create new one based on network
    if (!connection) {
        return new Connection(
            network === 'devnet' 
                ? DEVNET_ENDPOINT 
                : GENESYS_GO_RPC_ENDPOINT
        )
    }

    // For mainnet-beta, always use GenesysGo
    // For other networks, use provided connection
    return network === 'mainnet-beta'
        ? new Connection(GENESYS_GO_RPC_ENDPOINT)
        : connection
}