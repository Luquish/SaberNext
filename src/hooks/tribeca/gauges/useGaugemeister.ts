import { useGovernor } from '@/hooks/tribeca/useGovernor'
import { useGaugemeisterData } from '@/utils/tribeca/parsers'

/**
 * Hook to get the gaugemeister address from the governor
 * @returns The gaugemeister public key or null if not available
 */
export function useGaugemeister() {
    const { gauge } = useGovernor()
    return gauge ? gauge.gaugemeister : null
}

/**
 * Hook to get the gaugemeister data
 * @returns The gaugemeister data query result
 */
export function useGMData() {
    const gm = useGaugemeister()
    return useGaugemeisterData(gm)
}