import { Suspense } from 'react'
import { MainLayoutInner } from './MainLayoutInner'

interface Props {
    children: React.ReactNode
}

export function MainLayout({ children }: Props) {
    return (
        <MainLayoutInner>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </MainLayoutInner>
    )
}