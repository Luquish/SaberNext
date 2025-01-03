import { ReactNode, useCallback, useEffect } from 'react'
import clsx from 'clsx'

interface UniversalModalProps {
    children: ReactNode
    onClose?: () => void
    open: boolean
    setOpen: (open: boolean) => void
    title?: string
    className?: string
}

export function UniversalModal({
    children,
    onClose,
    open,
    setOpen,
    className,
}: UniversalModalProps) {
    const handleClose = useCallback(() => {
        setOpen(false)
        onClose?.()
    }, [onClose, setOpen])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                handleClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [open, handleClose])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    return (
        <div
            className={clsx(
                'fixed inset-0',
                'flex items-center justify-center',
                'transition-colors duration-200',
                'z-50',
                open ? 'visible bg-black/40 backdrop-blur-sm' : 'invisible',
                className
            )}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-hidden={!open}
        >
            {children}
        </div>
    )
}
