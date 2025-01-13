import type { Provider } from '@saberhq/solana-contrib'
import { TransactionEnvelope } from '@saberhq/solana-contrib'
import type { TokenAmount } from '@saberhq/token-utils'
import {
    getATAAddress,
    getOrCreateATA,
    NATIVE_MINT,
    SPLToken,
    TOKEN_PROGRAM_ID,
    TokenAccountLayout,
} from '@saberhq/token-utils'
import type { PublicKey } from '@solana/web3.js'
import { Keypair, SystemProgram } from '@solana/web3.js'

import { notify } from './notifications'

/**
 * Creates an ephemeral wrapped SOL account with the following steps:
 * 1. Initializes the account via system program, funding it with `amount` + `rent`
 * 2. Initializes the token account
 * 
 * Also returns instructions to close the account & return lamports to the user.
 */
export const createEphemeralWrappedSolAccount = async ({
    provider,
    amount,
    accountKP = Keypair.generate(),
    owner = provider.wallet.publicKey,
}: {
    provider: Provider
    amount: TokenAmount
    accountKP?: Keypair
    owner?: PublicKey
}): Promise<{
    accountKey: PublicKey
    init: TransactionEnvelope
    close: TransactionEnvelope
}> => {
    // Check rent-exempt balance requirement
    const balanceNeeded = await SPLToken.getMinBalanceRentForExemptAccount(
        provider.connection
    )
    const solBalance = amount.toU64().toNumber()
    const payer = provider.wallet.publicKey
    const payerBalance = await provider.connection.getBalance(payer)

    if (payerBalance < balanceNeeded) {
        notify({
            message: 'Insufficient SOL balance',
        })
        throw new Error(
            `Insufficient SOL balance: payerBalance: ${payerBalance} < balanceNeeded: ${balanceNeeded}`
        )
    }

    // Create and initialize the wrapped SOL account
    const initAccountInstructions = [
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: accountKP.publicKey,
            lamports: balanceNeeded + solBalance,
            space: (TokenAccountLayout as { span: number }).span,
            programId: TOKEN_PROGRAM_ID,
        }),
        SPLToken.createInitAccountInstruction(
            TOKEN_PROGRAM_ID,
            NATIVE_MINT,
            accountKP.publicKey,
            owner
        ),
    ]

    return {
        accountKey: accountKP.publicKey,
        init: new TransactionEnvelope(provider, initAccountInstructions, [accountKP]),
        close: new TransactionEnvelope(provider, [
            SPLToken.createCloseAccountInstruction(
                TOKEN_PROGRAM_ID,
                accountKP.publicKey,
                payer,
                owner,
                []
            ),
        ]),
    }
}

/**
 * Wraps SOL and sends it to an Associated Token Account (ATA)
 */
export const wrapAndSendSOLToATA = async ({
    provider,
    amount,
    accountKP = Keypair.generate(),
    owner = provider.wallet.publicKey,
    skipATACreation = false,
}: {
    provider: Provider
    amount: TokenAmount
    accountKP?: Keypair
    owner?: PublicKey
    skipATACreation?: boolean
}): Promise<TransactionEnvelope> => {
    const { init, accountKey, close } = await createEphemeralWrappedSolAccount({
        provider,
        amount,
        accountKP,
        owner,
    })

    // Get or create the ATA
    const { instruction: createInstruction, address } = await getOrCreateATA({
        provider,
        mint: NATIVE_MINT,
        owner,
    })

    // Add ATA creation instruction if needed
    if (createInstruction && !skipATACreation) {
        init.instructions.unshift(createInstruction)
    }

    // Add transfer instruction
    init.instructions.push(
        SPLToken.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            accountKey,
            address,
            owner,
            [],
            amount.toU64()
        )
    )

    return init.combine(close)
}

/**
 * Closes a wrapped SOL account
 */
export const closeWrappedAccount = async (
    provider: Provider,
    owner: PublicKey
): Promise<TransactionEnvelope> => {
    const wrappedAccount = await getATAAddress({ mint: NATIVE_MINT, owner })

    return new TransactionEnvelope(provider, [
        SPLToken.createCloseAccountInstruction(
            TOKEN_PROGRAM_ID,
            wrappedAccount,
            owner,
            owner,
            []
        ),
    ])
}