'use client'

import { Toaster, resolveValue, toast } from 'react-hot-toast'
import { VscClose } from 'react-icons/vsc'
import { useConditionalDarkMode } from '@/hooks/tribeca/useConditionalDarkMode'
import { TribecaProviders } from '@/providers/tribeca'
import { SaberProviders } from '@/providers/saber'
import { GovernorLayout } from '@/components/tribeca/layout/GovernorLayout'


export default function TribecaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    useConditionalDarkMode(true)

    return (
        <SaberProviders>
            <TribecaProviders>
                <GovernorLayout>
                    <div className="min-h-screen w-full">
                        <div className="w-full px-4">
                            {children}
                            <Toaster position="bottom-right">
                                {(t) => (
                                    <div
                                        className="bg-white border p-4 w-full max-w-sm shadow rounded relative dark:bg-gray-50 dark:border-warmGray-600"
                                        style={{
                                            opacity: t.visible ? 1 : 0,
                                        }}
                                    >
                                        <button
                                            className="absolute right-3 top-3 text-secondary hover:text-gray-600"
                                            onClick={() => toast.dismiss(t.id)}
                                        >
                                            <VscClose />
                                        </button>
                                        {resolveValue(t.message, t)}
                                    </div>
                                )}
                            </Toaster>
                        </div>
                    </div>
                </GovernorLayout>
            </TribecaProviders>
        </SaberProviders>
    )
}