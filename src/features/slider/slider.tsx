import 'keen-slider/keen-slider.min.css'

import { FC, ReactNode, memo } from 'react'
import { KeenSliderHooks, KeenSliderOptions, KeenSliderPlugin, useKeenSlider } from 'keen-slider/react'

const defaultOptions = {
    slideChanged() {
        console.log('slide changed')
    },
}

interface ISliderProps {
    slides: (number | string | ReactNode)[] | null
    options?: KeenSliderOptions<{}, {}, KeenSliderHooks>
    plugins?: KeenSliderPlugin<{}, {}, KeenSliderHooks>[]
}

const Slider: FC<ISliderProps> = ({
    slides = [],
    options = defaultOptions,
    plugins = [],
}) => {
    const [sliderRef, instanceRef] = useKeenSlider(options, plugins)

    if (slides?.length === 0) return <></>

    return (
        <div ref={sliderRef} className="keen-slider min-w-full max-w-full">
            {slides?.map((slide, index) => {
                return <div
                    key={index}
                    className="keen-slider__slide"
                >
                    {slide}
                </div>
            })}
        </div>
    )
}

export default memo(Slider)
