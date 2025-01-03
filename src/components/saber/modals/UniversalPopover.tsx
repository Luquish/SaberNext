import { forwardRef, useState, useImperativeHandle, memo, ReactNode } from 'react'
import { UniversalModal } from './UniversalModal'

interface UniversalPopoverProps {
    children: ReactNode
    onClose?: () => void
    className?: string
}

export interface PopoverRef {
    close: () => void
    isOpened: boolean
    open: () => void
    toggle: () => void
}

interface ModalProps extends UniversalPopoverProps {
    open: boolean
    setOpen: (isOpen: boolean) => void
}

const Modal = memo<ModalProps>(({ 
    children, 
    onClose, 
    open, 
    setOpen,
    className, 
}) => (
    <UniversalModal 
        onClose={onClose} 
        open={open} 
        setOpen={setOpen}
        className={className}
    >
        {children}
    </UniversalModal>
))

Modal.displayName = 'PopoverModal'

export const UniversalPopover = forwardRef<PopoverRef, UniversalPopoverProps>(
    function UniversalPopover({ onClose, children, className }, ref) {
        const [isOpen, setIsOpen] = useState(false)

        useImperativeHandle(
            ref, 
            () => ({
                close: () => setIsOpen(false),
                isOpened: isOpen,
                open: () => setIsOpen(true),
                toggle: () => setIsOpen(prev => !prev),
            }),
            [isOpen]
        )

        return (
            <Modal 
                onClose={onClose} 
                open={isOpen} 
                setOpen={setIsOpen}
                className={className}
            >
                {isOpen ? children : null}
            </Modal>
        )
    }
)

UniversalPopover.displayName = 'UniversalPopover'