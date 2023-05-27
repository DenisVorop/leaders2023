import { memo, useEffect, ReactNode } from 'react'

interface IPopupProps {
    onClose: () => void
    isVisible: boolean
    children: ReactNode
    className?: string
}

const Popup: React.FC<IPopupProps> = ({
    children,
    onClose,
    isVisible,
    className = '',
}) => {

    useEffect(() => {
        document.body.style.overflow = isVisible ? 'hidden' : 'auto'
        return () => { document.body.style.overflow = 'auto' }
    }, [isVisible])

    return (
        <div
            className={`
                fixed z-10 w-screen h-[100lvh] top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-all
                ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={onClose}
        >
            <div
                className={`
                rounded-lg card bg-white transition-all w-fit max-w-3xl ${className}
            `}
                style={{ transform: isVisible ? 'scale(1)' : 'scale(0)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default memo(Popup)
