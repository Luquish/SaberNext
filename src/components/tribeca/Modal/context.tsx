'use client'

import { noop } from 'lodash-es';
import { createContainer } from 'unstated-next';

function useModalInner(
    close: () => void = noop
): {
    close: () => void
} {
    if (!close) {
        throw new Error('no close provided')
    }
    return { close }
}

export const { useContainer: useModal, Provider: ModalProvider } =
    createContainer(useModalInner)
