'use client'

import { GovernancePage } from '@/components/tribeca/overview/GovernancePage';
import { MarinadeMigration } from '@/components/tribeca/MarinadeMigration';

function ProposalCreateView() {
    return (
        <GovernancePage
            title="Create a Proposal"
            preContent={<MarinadeMigration />}
            hideDAOName={true}
        />
    );
}

export { ProposalCreateView }