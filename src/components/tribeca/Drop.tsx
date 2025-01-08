'use client'

import type { Placement } from '@popperjs/core'
import { animated, config, useTransition } from '@react-spring/web'
import { useCallback, useRef, useState } from 'react'
import { usePopper } from 'react-popper'

import { useOnClickOutside } from '@/utils/tribeca/onClickOutside'

interface DropProps {
    onDismiss: () => void
    show: boolean
    target: Element | null
    children: React.ReactNode
    placement?: Placement
}

/**
 * Animated dropdown component with popper positioning
 */
function Drop({
    show,
    target,
    onDismiss,
    children,
    placement = 'auto',
}: DropProps) {
    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [popperElement, _setPopperElement] = useState<HTMLDivElement | null>(null)

    useOnClickOutside(popperElRef, show ? () => onDismiss() : undefined)

    const transition = useTransition(show, {
        from: { scale: 0.96, opacity: 1 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 1, opacity: 0 },
        config: { ...config.default, duration: 100 },
    })

    const setPopperElement = useCallback((el: HTMLDivElement) => {
        popperElRef.current = el
        _setPopperElement(el)
    }, [])

    const { styles, attributes } = usePopper(target, popperElement, {
        placement,
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 10],
                },
            },
        ],
    })

    return (
        <div
            className={`opacity-0 invisible z-[10] transition-[visibility,opacity] duration-150 linear
                ${show ? 'opacity-100 visible' : ''}`}
            ref={setPopperElement}
            style={{
                ...styles.popper,
            }}
            {...attributes.popper}
        >
            {transition(
                (springStyles, item) =>
                    item && <animated.div style={springStyles}>{children}</animated.div>
            )}
        </div>
    )
}

export { Drop }