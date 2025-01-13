'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { isMobile } from 'react-device-detect'
import { useGesture } from '@use-gesture/react'
import type { ReactNode } from 'react'

import { ModalProvider } from './context'

export interface ModalProps {
    children: ReactNode
    isOpen: boolean
    onDismiss: () => void
    darkenOverlay?: boolean
    className?: string
}

const AnimatedOverlay = animated(RadixDialog.Overlay)
const AnimatedContent = animated(RadixDialog.Content)

export function Modal({
    className,
    children,
    isOpen,
    onDismiss,
    darkenOverlay = true,
}: ModalProps) {
    const fadeTransition = useTransition(isOpen, {
        config: { duration: 150 },
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    const [{ y }, set] = useSpring(() => ({
        y: 0,
        config: { mass: 1, tension: 210, friction: 20 },
    }))
    
    const bind = useGesture({
        onDrag: (state) => {
            set({
                y: state.down ? state.movement[1] : 0,
            })
            if (
                state.movement[1] > 300 ||
                (state.velocity > 3 && state.direction[1] > 0)
            ) {
                onDismiss()
            }
        },
    })

    return (
        <>
            {fadeTransition(
                (transition, item) =>
                    item && (
                        <RadixDialog.Root open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
                            <AnimatedOverlay
                                style={{
                                    ...transition,
                                    background: darkenOverlay ? 'rgba(0, 0, 0, 0.55)' : 'none',
                                    zIndex: 11,
                                }}
                                className="fixed inset-0"
                            />
                            <AnimatedContent
                                className={`shadow-2xl w-full max-w-lg p-6 rounded-lg relative dark:bg-warmGray-850 ${className || ''}`}
                                style={{
                                    transform: y.to(
                                        (n) => `translateY(${n > 0 ? n : 0}px)`
                                    ),
                                }}
                                {...(isMobile ? bind() : {})}
                            >
                                <ModalProvider initialState={onDismiss}>
                                    {children}
                                </ModalProvider>
                            </AnimatedContent>
                        </RadixDialog.Root>
                    )
            )}
        </>
    )
}
