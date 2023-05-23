import { FC, memo } from 'react'

interface IDividerProps {
    vertical?: boolean
    className?: string
}

const Divider: FC<IDividerProps> = ({ vertical, className }) => {
    return (
        vertical
            ? <div className={`inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50 ${className}`} />
            : <hr className={`my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 ${className}`} />
    )
}

export default memo(Divider)
