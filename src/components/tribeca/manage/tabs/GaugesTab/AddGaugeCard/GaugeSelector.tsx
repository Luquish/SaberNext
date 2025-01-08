'use client'

import { useRewarder } from '@rockooor/react-quarry'

import { TableCardBody } from '@/components/tribeca/card/TableCardBody'
import { GaugeInfo } from './GaugeInfo'

/**
 * Component for displaying and selecting gauges in a table format
 */
function GaugeSelector() {
    const { quarries } = useRewarder()
    
    return (
        <TableCardBody
            head={
                <tr>
                    <th>Token</th>
                    <th>Mint</th>
                    <th>Enabled?</th>
                    <th>Actions</th>
                </tr>
            }
        >
            {quarries?.map((quarry) => (
                <GaugeInfo 
                    key={quarry.key.toString()} 
                    quarry={quarry} 
                />
            ))}
        </TableCardBody>
    )
}

export { GaugeSelector }