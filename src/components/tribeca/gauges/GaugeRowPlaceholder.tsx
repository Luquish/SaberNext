'use client'

import { ContentLoader } from '@/components/tribeca/ContentLoader'

/**
 * Placeholder row for gauge list while loading
 */
function GaugeRowPlaceholder() {
    return (
        <tr>
            <td>
                <div className="h-10 flex items-center">
                    <ContentLoader className="w-10 h-4" />
                </div>
            </td>
            <td>
                <div className="h-10 flex items-center">
                    <ContentLoader className="w-32 h-4" />
                </div>
            </td>
            <td>
                <div className="h-10 flex items-center">
                    <ContentLoader className="w-12 h-4" />
                </div>
            </td>
            <td>
                <div className="h-10 flex items-center">
                    <ContentLoader className="w-12 h-4" />
                </div>
            </td>
        </tr>
    )
}

export { GaugeRowPlaceholder }