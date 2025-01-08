'use client'

import '@reach/slider/styles.css'
import { SliderInput as ReachSlider } from '@reach/slider'

/**
 * Custom styled slider input component based on Reach UI Slider
 */
function InputSlider(props: React.ComponentProps<typeof ReachSlider>) {
    return (
        <ReachSlider
            {...props}
            className={`
                bg-none
                [&_[data-reach-slider-range]]:bg-none
                [&_[data-reach-slider-track]]:bg-gray-800
                [&_[data-reach-slider-track]]:rounded
                [&_[data-reach-slider-track]]:h-1
                [&_[data-reach-slider-track]]:bg-gradient-to-r
                [&_[data-reach-slider-track]]:from-gray-600
                [&_[data-reach-slider-track]]:to-gray-200
                [&_[data-reach-slider-handle]]:bg-gray-800
                [&_[data-reach-slider-handle]]:w-6
                [&_[data-reach-slider-handle]]:h-6
                [&_[data-reach-slider-handle]]:rounded-full
                [&_[data-reach-slider-handle]]:-webkit-appearance-none
                [&_[data-reach-slider-handle]]:appearance-none
                [&_[data-reach-slider-handle]]:cursor-pointer
                [&_[data-reach-slider-handle]]:shadow-[0px_6px_12px_8px_rgba(0,0,0,0.3)]
            `}
        />
    )
}

export { InputSlider }