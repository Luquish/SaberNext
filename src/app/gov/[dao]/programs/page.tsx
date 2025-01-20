'use client'

import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/overview/GovernancePage'
import { ProgramsList } from '@/components/tribeca/programs/ProgramsList'

export default function ProgramsView() {
    return (
        <GovernancePage title="Programs">
            <Card
                title={
                    <div tw="flex w-full items-center justify-between">
                        <div tw="flex items-center gap-4">
                            <h2>Manage Programs</h2>
                        </div>
                    </div>
                }
            >
                <ProgramsList />
            </Card>
        </GovernancePage>
    );
}