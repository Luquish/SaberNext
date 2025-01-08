'use client'

import {
    // useGovernor,
    useGovernorInfo,
} from '@/hooks/tribeca/useGovernor'
import { ReactNode, CSSProperties } from 'react'
// import NotFound from '@/app/(tribeca)/[dao]/not-found'
import { LoadingPage } from '@/components/tribeca/LoadingPage'
import { GovernancePageInner } from './GovernancePageInner'

interface Props {
    title: ReactNode
    header?: ReactNode
    right?: ReactNode
    preContent?: ReactNode
    children?: ReactNode
    contentStyles?: CSSProperties
    containerStyles?: CSSProperties
    hideDAOName?: boolean
    backLink?: {
        label: string
        href: string
    }
}

/**
 * Governance page wrapper with loading and not found states
 */
function GovernancePage(props: Props) {
    const info = useGovernorInfo()
    // const { governorData } = useGovernor()

    // if (!info || governorData === null) {
    //     return <NotFound />
    // }

    if (info?.loading) {
        return <LoadingPage />
    }

    return <GovernancePageInner {...props} />
}

export { GovernancePage }