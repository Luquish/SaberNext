import { ACCOUNT_DISCRIMINATOR_SIZE } from '@project-serum/anchor/dist/cjs/coder';
import { useAccountData } from '@rockooor/sail';
import { SuperCoder } from '@saberhq/anchor-contrib';
import type { KeyedAccountInfo, PublicKey } from '@solana/web3.js';
import { SystemProgram } from '@solana/web3.js';
import { startCase } from 'lodash-es';
import { useMemo } from 'react';
import Link from 'next/link';

import { useSubaccountInfo } from '@/hooks/tribeca/useSubaccountInfo';
import { useIDL } from '@/hooks/tribeca/useIDLs';
import { SYSVAR_OWNER } from '@/utils/tribeca/programs';
import { AddressLink } from '../AddressLink';
import { ProgramLabel } from './ProgramLabel';
import { SolAmount } from './SolAmount';

type AccountValidator = (account: KeyedAccountInfo) => string | undefined;

export const createFeePayerValidator = (
    feeLamports: number
): AccountValidator => {
    return (account: KeyedAccountInfo): string | undefined => {
        if (!account.accountInfo.owner.equals(SystemProgram.programId))
            return 'Only system-owned accounts can pay fees';
        // TODO: Actually nonce accounts can pay fees too
        if (account.accountInfo.data.length > 0)
            return 'Only unallocated accounts can pay fees';
        if (account.accountInfo.lamports < feeLamports) {
            return 'Insufficient funds for fees';
        }
        return;
    };
};

export const programValidator = (
    account: KeyedAccountInfo
): string | undefined => {
    if (!account.accountInfo.executable)
        return 'Only executable accounts can be invoked';
    return;
};

interface Props {
  className?: string;
  pubkey: PublicKey;
  validator?: AccountValidator;
  prefixLinkUrlWithAnchor?: boolean;
}

export const AddressWithContext = ({
    className,
    pubkey,
    validator,
    prefixLinkUrlWithAnchor = false,
}: Props) => {
    const info = useAccountData(pubkey);
    return (
        <div className={`flex flex-col items-start gap-1 ${className}`}>
            {info.data?.accountInfo.executable ? (
                <ProgramLabel
                    address={pubkey}
                    showCopy
                    showRaw={false}
                    shorten={false}
                />
            ) : (
                <AddressLink
                    className="text-saber font-mono"
                    address={pubkey}
                    showCopy
                    showRaw={false}
                    shorten={false}
                    prefixLinkUrlWithAnchor={prefixLinkUrlWithAnchor}
                />
            )}
            {/* Se asegura que AccountInfo esté en una línea separada */}
            <AccountInfo pubkey={pubkey} validator={validator} />
        </div>
    );
};


interface Props {
  pubkey: PublicKey;
  validator?: AccountValidator;
}

export const AccountInfo = ({ pubkey, validator }: Props) => {
    const info = useAccountData(pubkey);
    const { data: idl } = useIDL(info.data?.accountInfo.owner);
    const subaccountInfo = useSubaccountInfo(pubkey);

    const accountName = useMemo(() => {
        if (!idl?.idl || !info.data) {
            return null;
        }
        const discriminator = info.data.accountInfo.data
            .slice(0, ACCOUNT_DISCRIMINATOR_SIZE)
            .toString('hex');
        const sc = new SuperCoder(idl.programID, idl.idl);
        return sc.discriminators[discriminator] ?? null;
    }, [idl?.idl, idl?.programID, info.data]);

    if (!info.data) {
        if (info.loading || subaccountInfo.isLoading) {
            return (
                <span tw="text-gray-600 dark:text-gray-300">
                    <span className="spinner-grow spinner-grow-sm me-2"></span>
          Loading
                </span>
            );
        } else {
            if (subaccountInfo.data) {
                const subaccountData = subaccountInfo.data.account;
                return (
                    <span>
                        {startCase(Object.keys(subaccountData.subaccountType)[0])} #
                        {subaccountData.index.toString()} of Smart Wallet{' '}
                        <Link
                            className="text-saber hover:text-white transition-colors"
                            href={`/address/${subaccountData.smartWallet.toString()}`}
                        >
                            {subaccountData.smartWallet.toString()}
                        </Link>
            .
                    </span>
                );
            }
            return <span>Account not found</span>;
        }
    }

    const errorMessage = validator && validator(info.data);
    if (errorMessage) return <span tw="text-accent">{errorMessage}</span>;

    if (info.data.accountInfo.executable) {
        return (
            <span tw="text-gray-600 dark:text-gray-300">Executable Program</span>
        );
    }

    const owner = info.data.accountInfo.owner;

    return (
        <div className="text-saber">
            {owner ? (
                <>
                    {/* Propietario y Balance juntos en la segunda línea */}
                    <div className="mt-1 text-white">
                        {owner.equals(SYSVAR_OWNER) ? (
                            'Sysvar.'
                        ) : (
                            <>
                                {accountName ? (
                                    <Link
                                        className="text-saber hover:text-white transition-colors"
                                        href={`/address/${info.data.accountId.toString()}`}
                                    >
                                        {accountName}
                                    </Link>
                                ) : (
                                    'Owned by'
                                )} owned by{' '}
                                <ProgramLabel address={owner} />. Balance is{' '}
                                <SolAmount lamports={info.data.accountInfo.lamports} />.
                            </>
                        )}
                    </div>
                </>
            ) : (
                'Account doesn\'t exist'
            )}
        </div>
    );
};