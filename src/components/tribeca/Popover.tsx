'use client'

import type { Placement } from '@popperjs/core'
import { animated, config, useTransition } from '@react-spring/web'
import { useState } from 'react'
import { usePopper } from 'react-popper'

export interface PopoverProps {
    content: React.ReactNode
    guide?: boolean
    show: boolean
    children: React.ReactNode
    placement?: Placement
}

/**
 * Popover component with animations and arrow
 */
function Popover({
    content,
    children,
    placement = 'auto',
    show,
}: PopoverProps) {
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement,
        modifiers: [
            { name: 'offset', options: { offset: [8, 8] } },
            { name: 'arrow', options: { element: arrowElement } },
        ],
    })

    const transition = useTransition(show, {
        from: { scale: 0.96, opacity: 1 },
        enter: { scale: 1, opacity: 1 },
        leave: { scale: 1, opacity: 0 },
        config: { ...config.default, duration: 100 },
    })

    return (
        <>
            <div ref={setReferenceElement}>{children}</div>
            {show &&
                transition(
                    (springStyles, item) =>
                        item && (
                            <div
                                className={`
                                    absolute
                                    ${show ? 'opacity-100 visible' : ''}
                                    z-10 transition-[visibility,opacity] duration-150
                                `}
                                ref={setPopperElement}
                                style={styles.popper}
                                {...attributes.popper}
                            >
                                <animated.div
                                    className="rounded shadow text-base bg-gray-200 dark:bg-warmGray-800"
                                    style={springStyles}
                                >
                                    {content}
                                </animated.div>
                                <div
                                    className={`
                                        arrow-${attributes.popper?.['data-popper-placement'] ?? ''}
                                        w-2 h-2 z-[9998]
                                        before:absolute before:w-2 before:h-2 before:z-[9998]
                                        before:content-[''] before:rotate-45
                                        [&.arrow-top]:bottom-[-5px] [&.arrow-top]:before:border-t-0 [&.arrow-top]:before:border-l-0
                                        [&.arrow-bottom]:top-[-5px] [&.arrow-bottom]:before:border-b-0 [&.arrow-bottom]:before:border-r-0
                                        [&.arrow-left]:right-[-5px] [&.arrow-left]:before:border-b-0 [&.arrow-left]:before:border-l-0
                                        [&.arrow-right]:left-[-5px] [&.arrow-right]:before:border-r-0 [&.arrow-right]:before:border-t-0
                                    `}
                                    ref={setArrowElement}
                                    style={styles.arrow}
                                    {...attributes.arrow}
                                />
                            </div>
                        )
                )}
        </>
    )
}

export { Popover }