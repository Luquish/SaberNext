'use client'

import { Suspense } from 'react'

import { Header } from './Header'
import { PageLayout } from './PageLayout'

interface Props {
    children?: React.ReactNode
}

export function MainLayoutInner({ children }: Props) {
    return (
        <div className='relative'>
            <div className='w-11/12 mx-auto'>
                <Header />
            </div>
            <PageLayout>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </PageLayout>
        </div>
    )
}