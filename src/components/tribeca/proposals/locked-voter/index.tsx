'use client'

import { Switch } from '@headlessui/react'
import Link from 'next/link'
import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'

import { Card } from '@/components/tribeca/Card'
import { GovernancePage } from '@/components/tribeca/GovernancePage'
import { useGovernor, useGovWindowTitle } from '@/hooks/tribeca/useGovernor'
import { ProposalsList } from '@/components/tribeca/overview/locked-voter/ProposalsList'
import { LegendsNeverDie } from './LegendsNeverDie'

/**
 * Wrapper component for proposal badges with responsive width
 */
function ProposalBadgeWrapper({ 
    children, 
    className = '', 
}: { 
    children: React.ReactNode
    className?: string 
}) {
    return (
        <div className={`w-16 md:w-20 lg:w-[140px] ${className}`}>
            {children}
        </div>
    )
}

/**
 * View component for listing governance proposals with draft toggle
 */
function ProposalsListView() {
    const { path } = useGovernor()
    const [showDrafts, setShowDrafts] = useState(false)
    useGovWindowTitle('Proposals')

    return (
        <GovernancePage 
            title="Governance Proposals" 
            right={<LegendsNeverDie />}
        >
            <Card
                title={
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2>All Proposals</h2>
                            <Link
                                href={`${path}/proposals/create`}
                                className="pt-0.5 flex items-center text-primary hover:text-white transition-all"
                            >
                                <button>
                                    <FaPlusCircle />
                                </button>
                            </Link>
                        </div>
                        <ProposalBadgeWrapper className="flex gap-4 w-auto md:w-[140px] md:justify-end">
                            <Switch.Group>
                                <div className="flex items-center text-sm">
                                    <Switch
                                        checked={showDrafts}
                                        onChange={setShowDrafts}
                                        className={`
                                            relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                                            ${showDrafts ? 'bg-primary' : 'bg-warmGray-600'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                                                ${showDrafts ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </Switch>
                                    <Switch.Label className="ml-2 font-medium text-warmGray-400">
                                        Show Drafts
                                    </Switch.Label>
                                </div>
                            </Switch.Group>
                        </ProposalBadgeWrapper>
                    </div>
                }
            >
                <ProposalsList showDrafts={showDrafts} />
            </Card>
        </GovernancePage>
    )
}

export { ProposalsListView }