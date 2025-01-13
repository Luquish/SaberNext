'use client'

import * as RadixSlider from '@radix-ui/react-slider'

/**
 * Custom styled slider input component based on Radix UI Slider
 */
function InputSlider(props: RadixSlider.SliderProps) {
    return (
        <RadixSlider.Root
            {...props}
            className="relative flex items-center w-full h-6 select-none touch-none"
        >
            <RadixSlider.Track className="bg-gray-800 rounded-full flex-1 h-1">
                <RadixSlider.Range className="bg-gradient-to-r from-gray-600 to-gray-200 rounded-full h-full" />
            </RadixSlider.Track>
            <RadixSlider.Thumb
                className="w-6 h-6 bg-gray-800 rounded-full cursor-pointer shadow-[0px_6px_12px_8px_rgba(0,0,0,0.3)] focus:outline-none"
            />
        </RadixSlider.Root>
    )
}

export { InputSlider }
