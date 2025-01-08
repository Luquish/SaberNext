'use client'

import '@reach/dialog/styles.css'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import { animated, useSpring, useTransition } from '@react-spring/web'
import { isMobile } from 'react-device-detect'
import { useGesture } from 'react-use-gesture'
import type { ReactNode } from 'react'

import { ModalProvider } from './context'

export interface ModalProps {
    children: ReactNode
    isOpen: boolean
    onDismiss: () => void
    darkenOverlay?: boolean
    className?: string
}

const AnimatedDialogOverlay = animated(DialogOverlay)
const AnimatedDialogContent = animated(DialogContent)

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
                        <AnimatedDialogOverlay
                            style={{
                                ...transition,
                                background: darkenOverlay ? 'rgba(0, 0, 0, 0.55)' : 'none',
                                zIndex: 11,
                            }}
                            isOpen={isOpen || transition.opacity.get() !== 0}
                            onDismiss={onDismiss}
                        >
                            <AnimatedDialogContent
                                className={`shadow-2xl w-full max-w-lg p-6 rounded-lg relative dark:bg-warmGray-850 ${className || ''}`}
                                aria-label='dialog content'
                                {...(isMobile
                                    ? {
                                        ...bind(),
                                        style: {
                                            transform: y.to(
                                                (n) => `translateY(${n > 0 ? n : 0}px)`
                                            ),
                                        },
                                    }
                                    : {})}
                            >
                                <ModalProvider initialState={onDismiss}>
                                    {children}
                                </ModalProvider>
                            </AnimatedDialogContent>
                        </AnimatedDialogOverlay>
                    )
            )}
        </>
    )
}