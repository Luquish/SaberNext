import { IoClose } from 'react-icons/io5'
import clsx from 'clsx'

interface ModalHeaderProps {
    handleClose: () => void
    title?: string
    className?: string
}

export function ModalHeader({ 
    handleClose, 
    title,
    className, 
}: ModalHeaderProps) {
    return (
        <div
            className={clsx(
                'flex items-center justify-between pb-3 md:pb-3',
                title && 'border-b border-gray-700 rounded-t',
                className
            )}
        >
            {title && (
                <h3 className="text-xl font-semibold text-gray-300">
                    {title}
                </h3>
            )}

            <button
                onClick={handleClose}
                type="button"
                className={clsx(
                    'text-gray-300 hover:text-white transition-colors',
                    'bg-transparent rounded-lg',
                    'w-8 h-8',
                    'inline-flex justify-center items-center',
                    !title && 'ms-auto'
                )}
                aria-label="Close modal"
            >
                <IoClose className='w-5 h-5' />
            </button>
        </div>
    )
}
