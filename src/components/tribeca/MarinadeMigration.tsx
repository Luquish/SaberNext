'use client'

import { HiOutlineExternalLink } from 'react-icons/hi'

/**
 * Migration notice component for Marinade governance
 */
function MarinadeMigration() {
    return (
        <div className="w-full p-6 border-2 border-[#FFD84D] bg-[#FFD84D]/10 rounded-lg flex flex-col items-center text-center">
            <h1 className="text-white text-2xl font-bold">
                Marinade Governance has moved to{' '}
                <a
                    href="https://app.realms.today/dao/mnde"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00D18C] hover:underline inline-flex gap-2 items-center"
                >
                    Realms
                    <HiOutlineExternalLink />
                </a>
            </h1>
            <p className="text-white mt-4 mb-6">
                Tribeca is deprecated for Marinade. To migrate your locked MNDE, go to{' '}
                <a
                    href="https://marinade.finance/app/mnde"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00D18C] hover:underline inline-flex gap-1 items-center"
                >
                    Marinade.Finance app
                    <HiOutlineExternalLink />
                </a>{' '}
                and follow the instructions to migrate your locked MNDE to the new
                system and use your tokens&apos; voting power in Realms!
            </p>
            <a
                href="https://marinade.finance/app/mnde"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#00D18C] hover:bg-[#00D18C]/10 px-4 py-2.5 text-[#00D18C] font-bold text-lg rounded"
            >
                Go to migration
                <HiOutlineExternalLink />
            </a>
        </div>
    )
}

export { MarinadeMigration }