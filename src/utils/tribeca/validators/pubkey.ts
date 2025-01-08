import { Keypair, PublicKey } from '@solana/web3.js'
import { coerce, instance, string } from 'superstruct'
import * as Yup from 'yup'

/**
 * Coerces a string into a PublicKey instance
 */
export const PublicKeyFromString = coerce(
    instance(PublicKey),
    string(),
    (value) => new PublicKey(value)
)

/**
 * Yup validator for a PublicKey string
 */
export const YupPublicKey = Yup.string().test(
    'Public Key',
    'Invalid public key',
    (str) => {
        if (!str) return true
        
        try {
            new PublicKey(str)
            return true
        } catch (e) {
            return false
        }
    }
)

/**
 * Yup validator for a Keypair JSON string
 */
export const YupKeypair = Yup.string().test(
    'Keypair',
    'Invalid keypair JSON',
    (str) => {
        if (!str) return true
        
        try {
            return !!kpSeedToKP(str)
        } catch (e) {
            return false
        }
    }
)

/**
 * Converts a JSON string containing a secret key into a Keypair
 */
export function kpSeedToKP(secretKey: string): Keypair {
    const secretKeyArray = JSON.parse(secretKey) as number[]
    return Keypair.fromSecretKey(Uint8Array.from(secretKeyArray))
}