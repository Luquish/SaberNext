'use client';

import { useState } from 'react';

import { Button } from '../Button';
import { Modal } from '.';

type Props = {
  buttonLabel: string;
  buttonProps?: React.ComponentProps<typeof Button>;
  children?: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
};

export function ModalButton({
    buttonLabel,
    buttonProps,
    children,
    className,
    onDismiss,
}: Props) {
    const [showModal, setShowModal] = useState<boolean>(false);
    return (
        <>
            <Modal
                isOpen={showModal}
                onDismiss={() => {
                    onDismiss?.();
                    setShowModal(false);
                }}
                className={className}
            >
                {children}
            </Modal>
            <Button
                {...buttonProps}
                onClick={() => {
                    setShowModal(true);
                }}
            >
                {buttonLabel}
            </Button>
        </>
    );
}
