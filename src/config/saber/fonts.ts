import { type NextFont } from 'next/dist/compiled/@next/font'
import localFont from 'next/font/local'
import { Inter, Josefin_Sans, Montserrat } from 'next/font/google'

/**
 * Inter Display font configuration
 * Weights: Regular (400), Medium (500)
 */
export const interDisplay: NextFont = localFont({
    src: [
        {
            path: '../../../public/saber/fonts/InterDisplay-Regular.woff2',
            weight: '400',
            style: 'regular',
        },
        {
            path: '../../../public/saber/fonts/InterDisplay-Medium.woff2',
            weight: '500',
            style: 'medium',
        },
    ],
    display: 'swap',
})

/**
 * Inter font configuration
 * Weights: 100 (Thin), 300 (Light), 600 (Semi-bold)
 */
export const inter: NextFont = Inter({
    subsets: ['latin'],
    weight: ['100', '300', '600'],
    display: 'swap',
})

/**
 * Josefin Sans font configuration
 * Weights: 200 (Extra-light), 600 (Semi-bold)
 */
export const josefin: NextFont = Josefin_Sans({
    subsets: ['latin'],
    weight: ['200', '600'],
    display: 'swap',
})

/**
 * Montserrat font configuration
 * Weight: 500 (Medium)
 */
export const montserrat: NextFont = Montserrat({
    subsets: ['latin'],
    weight: ['500'],
    display: 'swap',
}) 