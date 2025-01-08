'use client'

import { ModalButton } from '@/components/tribeca/Modal/ModalButton'
import { useAllGauges } from '@/hooks/tribeca/gauges/useGauges'
import { EnableAllGaugesModal } from './EnableAllGaugesModal'

/**
 * Button component that opens the enable all gauges modal
 */
function EnableGaugesButton() {
    const { gauges } = useAllGauges()
    
    return (
        <ModalButton
            buttonLabel="Enable All Gauges"
            buttonProps={{
                variant: 'outline',
            }}
        >
            <EnableAllGaugesModal gauges={gauges} />
        </ModalButton>
    )
}

export { EnableGaugesButton }