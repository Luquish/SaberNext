import { findMinterAddress, QUARRY_CODERS } from '@quarryprotocol/quarry-sdk';
import {
    TOKEN_ACCOUNT_PARSER,
    useAccountData,
    useParsedAccountData,
    usePubkey,
    useSail,
} from '@rockooor/sail';
import {
    RedeemerWrapper,
    Saber,
    SABER_ADDRESSES,
} from '@saberhq/saber-periphery';
import { buildStubbedTransaction, PublicKey } from '@saberhq/solana-contrib';
import {
    getATAAddress,
    getOrCreateATA,
    SPLToken,
    TOKEN_PROGRAM_ID,
} from '@saberhq/token-utils';
import type { TransactionInstruction } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import invariant from 'tiny-invariant';

import { AsyncButton } from '@/components/tribeca/AsyncButton';
import { InputText } from '@/components/tribeca/inputs/InputText';
import { InputTokenAmount } from '@/components/tribeca/inputs/InputTokenAmount';
import { useGovernor } from '@/hooks/tribeca/useGovernor';
import { useParseTokenAmount } from '@/hooks/tribeca/useParseTokenAmount';
import { useProvider } from '@/hooks/tribeca/useProvider';
import { useWrapTx } from '@/hooks/tribeca/useWrapTx';
import { serializeToBase64 } from '@/utils/tribeca/makeTransaction';
import { useParsedMintWrapper } from '@/utils/tribeca/parsers';
import type { ActionFormProps } from '../../types';

interface Props extends ActionFormProps {
    actor: PublicKey
    ctx: any // Tipado específico requerido
    setError: (error: string | null) => void
    setTxRaw: (txRaw: string) => void
}

/**
 * Action component for issuing tokens through a minter
 */
function IssueTokensAction({ actor, ctx, setError, setTxRaw }: Props) {
    const { govToken } = useGovernor()
    const [amountStr, setAmountStr] = useState('')
    const [destinationStr, setDestinationStr] = useState('')
    const { network, providerMut } = useProvider()
    const amount = useParseTokenAmount(govToken, amountStr)
    const recipient = usePubkey(destinationStr)
    const { handleTX } = useSail()
    const { wrapTx } = useWrapTx()

    const minter = ctx?.minter;
    const mintWrapper = useMemo(
        () => (minter ? minter.mintWrapper : null),
        [minter]
    );
    const { data: mintWrapperData } = useParsedMintWrapper(mintWrapper);
    const redeemer = useMemo(
        () => (minter?.redeemer ? new PublicKey(minter.redeemer) : null),
        [minter?.redeemer]
    );
    const { data: redeemerData } = useAccountData(redeemer);

    const { data: iouATAKey } = useQuery({
        queryKey: [
            'ata',
            mintWrapperData?.accountInfo.data.tokenMint,
            actor?.toString(),
        ],
        queryFn: async () => {
            invariant(mintWrapperData && actor);
            return await getATAAddress({
                mint: mintWrapperData.accountInfo.data.tokenMint,
                owner: actor,
            });
        },
        enabled: !!mintWrapperData && !!actor,
    });
    const { data: iouATA } = useParsedAccountData(
        iouATAKey,
        TOKEN_ACCOUNT_PARSER
    );

    const outputToken = redeemer
        ? govToken?.mintAccount
        : mintWrapperData?.accountInfo.data.tokenMint;
    const { data: outputATAKey } = useQuery({
        queryKey: ['ata', outputToken?.toString(), actor?.toString()],
        queryFn: async () => {
            invariant(outputToken && actor);
            return await getATAAddress({
                mint: outputToken,
                owner: actor,
            });
        },
        enabled: !!mintWrapperData && !!actor,
    });
    const { data: outputATA } = useParsedAccountData(
        outputATAKey,
        TOKEN_ACCOUNT_PARSER
    );

    const { data: recipientATAKey } = useQuery({
        queryKey: ['ata', outputToken?.toString(), recipient?.toString()],
        queryFn: async () => {
            invariant(outputToken && recipient);
            return await getATAAddress({
                mint: outputToken,
                owner: recipient,
            });
        },
        enabled: !!outputToken && !!recipient,
    });
    const { data: recipientATA } = useParsedAccountData(
        recipientATAKey,
        TOKEN_ACCOUNT_PARSER
    );

    useEffect(() => {
        if (
            !providerMut ||
            !mintWrapper ||
            !actor ||
            !amount ||
            !recipient ||
            !mintWrapperData ||
            (redeemer && !redeemerData) ||
            !govToken
        ) {
            return;
        }
        void (async () => {
            const [minter] = await findMinterAddress(mintWrapper, actor);

            const ixs: TransactionInstruction[] = [];

            const smartWalletMintTokens = await getATAAddress({
                mint: mintWrapperData.accountInfo.data.tokenMint,
                owner: actor,
            });
            const destinationATA = await getATAAddress({
                mint: mintWrapperData.accountInfo.data.tokenMint,
                owner: recipient,
            });

            const mintDestination = redeemerData
                ? smartWalletMintTokens
                : destinationATA;

            const mintIX = QUARRY_CODERS.MintWrapper.encodeIX(
                'performMint',
                { amount: amount.toU64() },
                {
                    mintWrapper,
                    minterAuthority: actor,
                    destination: mintDestination,
                    minter,
                    tokenMint: mintWrapperData.accountInfo.data.tokenMint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                }
            );
            ixs.push(mintIX);

            if (redeemerData) {
                if (redeemerData.accountInfo.owner.equals(SABER_ADDRESSES.Redeemer)) {
                // handle mint proxy redemption
                    const redeemerW = await RedeemerWrapper.load({
                        sdk: Saber.load({ provider: providerMut }),
                        iouMint: mintWrapperData.accountInfo.data.tokenMint,
                        redemptionMint: govToken.mintAccount,
                    });

                    const smartWalletUnderlyingATA = await getATAAddress({
                        mint: govToken.mintAccount,
                        owner: actor,
                    });
                    const underlyingATA = await getATAAddress({
                        mint: govToken.mintAccount,
                        owner: recipient,
                    });

                    const redeemIX = await redeemerW.redeemTokensFromMintProxyIx({
                        tokenAmount: amount.toU64(),
                        sourceAuthority: actor,
                        iouSource: mintDestination,
                        redemptionDestination: smartWalletUnderlyingATA,
                    });
                    ixs.push(redeemIX);

                    ixs.push(
                        SPLToken.createTransferInstruction(
                            TOKEN_PROGRAM_ID,
                            smartWalletUnderlyingATA,
                            underlyingATA,
                            actor,
                            [],
                            amount.toU64()
                        )
                    );
                }
            }

            try {
                const txStub = buildStubbedTransaction(
                    network !== 'localnet' ? network : 'devnet',
                    ixs
                );
                setTxRaw(serializeToBase64(txStub));
                setError(null);
            } catch (ex) {
                setTxRaw('');
                console.debug('Error issuing tokens', ex);
                setError('Error generating proposal');
            }
        })();
    }, [
        amount,
        recipient,
        govToken,
        mintWrapper,
        mintWrapperData,
        network,
        providerMut,
        redeemer,
        redeemerData,
        setError,
        setTxRaw,
        actor,
    ]);

    return (
        <>
            <InputTokenAmount
                label="Amount"
                token={govToken ?? null}
                tokens={[]}
                className="h-auto"
                inputValue={amountStr}
                inputDisabled={!actor}
                inputOnChange={setAmountStr}
            />
            <label className="flex flex-col gap-1" htmlFor="destination">
                <span className="text-sm">Recipient</span>
                <InputText
                    id="destination"
                    placeholder="Address to give tokens to."
                    value={destinationStr}
                    onChange={(e) => setDestinationStr(e.target.value)}
                />
            </label>
            {((iouATAKey && iouATA === null) ||
            (outputATAKey && outputATA === null) ||
            (recipientATAKey && recipientATA === null)) && (
                <AsyncButton
                    disabled={!mintWrapperData || !actor || !outputToken}
                    onClick={async (sdkMut) => {
                        invariant(mintWrapperData && actor && outputToken)
                        const ixs: (TransactionInstruction | null)[] = []
                    
                        // Create ATAs
                        const { instruction: createMintWrapperATAIX } = 
                        await getOrCreateATA({
                            provider: sdkMut.provider,
                            mint: mintWrapperData.accountInfo.data.tokenMint,
                            owner: actor,
                        })
                        ixs.push(createMintWrapperATAIX)

                        if (!outputToken.equals(mintWrapperData.accountInfo.data.tokenMint)) {
                            const { instruction: createRedeemATAIX } = 
                            await getOrCreateATA({
                                provider: sdkMut.provider,
                                mint: outputToken,
                                owner: actor,
                            })
                            ixs.push(createRedeemATAIX)
                        }

                        if (recipient) {
                            const { instruction: recipientATA } = 
                            await getOrCreateATA({
                                provider: sdkMut.provider,
                                mint: outputToken,
                                owner: recipient,
                            })
                            ixs.push(recipientATA)
                        }

                        const { pending, success } = await handleTX(
                            await wrapTx(sdkMut.provider.newTX(ixs)),
                            'Create token accounts'
                        )
                        
                        if (!success || !pending) return
                        await pending.wait()
                    }}
                >
                    Create token accounts
                </AsyncButton>
            )}
        </>
    );
}
export { IssueTokensAction };
