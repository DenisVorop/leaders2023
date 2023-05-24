import React from 'react'

export default function useHover(ref: React.RefObject<HTMLDivElement>): boolean {
    const [isHovering, setIsHovering] = React.useState(false)

    const on = () => setIsHovering(true)
    const off = () => setIsHovering(false)

    React.useEffect(() => {
        if (!ref.current) {
            return
        }
        const node = ref.current

        node.addEventListener('mouseenter', on)
        node.addEventListener('mousemove', on)
        node.addEventListener('mouseleave', off)

        return function () {
            node.removeEventListener('mouseenter', on)
            node.removeEventListener('mousemove', on)
            node.removeEventListener('mouseleave', off)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return isHovering
}
