'use client';

import { FaTimes } from 'react-icons/fa';

import { Button } from '../Button';
import { useModal } from './context';

interface Props {
  title: string;
  children?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  className?: string;
}

export function ModalInner({
    title,
    children,
    buttonProps,
    className,
}: Props) {
    const { close } = useModal();
    return (
        <>
            <div className="relative border-b dark:border-b-warmGray-800 dark:text-white font-bold text-base text-center py-4">
                <div className="px-8 overflow-ellipsis overflow-hidden whitespace-nowrap">
                    {title}
                </div>
                <button
                    onClick={() => close()}
                    className="absolute right-4 h-full flex items-center top-0 text-warmGray-600 hover:text-warmGray-200 transition-colors"
                >
                    <FaTimes />
                </button>
            </div>
            <div className={`p-8 ${className}`}>
                {children}
                {buttonProps && <Button className="mt-8 w-full h-10" {...buttonProps} />}
            </div>
        </>
    );
}
