'use client'

import type { Interpolation, Theme } from '@emotion/react'
import { useState } from 'react'

import { AsyncButton } from './AsyncButton'
import { Modal } from './Modal'

interface ModalConfig {
    title: string
    disabled?: boolean
    contents: React.ReactNode
    style?: Interpolation<Theme>
    innerStyles?: Interpolation<Theme>
}

interface Props extends React.ComponentProps<typeof AsyncButton> {
    modal: ModalConfig
}

/**
 * Button that shows a confirmation modal before executing the action
 */
function AsyncConfirmButton({
    children,
    onClick,
    modal: { 
        title, 
        contents, 
        disabled, 
        style: modalStyle, 
        innerStyles, 
    },
    ...buttonProps
}: Props) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <Modal
                className="p-0"
                isOpen={showModal}
                onDismiss={() => setShowModal(false)}
                css={modalStyle}
            >
                <div className="border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4">
                    {title}
                </div>
                <div className="p-8 flex flex-col items-center" css={innerStyles}>
                    {contents}
                    <AsyncButton
                        className="mt-8 w-full"
                        {...buttonProps}
                        disabled={disabled}
                        onClick={onClick}
                    >
                        {title}
                    </AsyncButton>
                </div>
            </Modal>

            <AsyncButton
                {...buttonProps}
                onClick={() => setShowModal(true)}
            >
                {children}
            </AsyncButton>
        </>
    )
}

export { AsyncConfirmButton }