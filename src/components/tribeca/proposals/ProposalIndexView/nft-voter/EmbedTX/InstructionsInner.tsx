'use client'

import { useTransaction } from '@/components/tribeca/wallet/context'
import { InstructionPreview } from './InstructionPreview'

/**
 * Component that renders a list of instruction previews
 */
function InstructionsInner() {
    const { instructions } = useTransaction()
    
    return (
        <div className="grid gap-4">
            {instructions?.map((instruction, i) => (
                <InstructionPreview
                    key={`ix_${i}`}
                    instruction={instruction}
                    index={i}
                />
            ))}
        </div>
    )
}

export { InstructionsInner }