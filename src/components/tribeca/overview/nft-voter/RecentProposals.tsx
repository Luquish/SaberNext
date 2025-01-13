'use client';

import { useGovernor } from '@/hooks/tribeca/useGovernor';
import { Card } from '@/components/tribeca/Card';
import { ProposalsList } from './ProposalsList';

export function RecentProposals() {
    const { path } = useGovernor();
    return (
        <Card
            title='Recent Proposals'
            link={{
                title: 'View all proposals',
                href: `${path}/proposals`,
            }}
        >
            <ProposalsList maxCount={3} />
        </Card>
    );
}
