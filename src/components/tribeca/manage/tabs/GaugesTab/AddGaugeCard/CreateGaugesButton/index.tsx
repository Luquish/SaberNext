'use client'

import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import { CreateGaugesModal } from './CreateGaugesModal'

/**
 * Button component that opens the create gauges modal
 */
function CreateGaugesButton() {
    return (
        <ModalButton
            buttonLabel="Create Gauges"
            buttonProps={{
                variant: 'outline',
            }}
        >
            <CreateGaugesModal />
        </ModalButton>
    )
}

export { CreateGaugesButton }