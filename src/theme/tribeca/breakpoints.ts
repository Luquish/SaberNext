export const BREAKPOINT_SIZES = {
    mobile: 576,
    tablet: 780,
    medium: 992,
    large: 1200,
} as const

export const breakpoints = {
    mobile: `@media (max-width: ${BREAKPOINT_SIZES.mobile}px)`,
    tablet: `@media (max-width: ${BREAKPOINT_SIZES.tablet}px)`,
    medium: `@media (max-width: ${BREAKPOINT_SIZES.medium}px)`,
    large: `@media (max-width: ${BREAKPOINT_SIZES.large}px)`,
}