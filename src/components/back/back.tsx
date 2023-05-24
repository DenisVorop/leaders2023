import Link from 'next/link'
import { FC, memo } from 'react'

interface IBackProps { link?: string, label?: string }
const Back: FC<IBackProps> = ({ link = '/dashboard', label = 'На главную' }) => {
    return (
        <Link href={link} className='w-fit'>
            <span className='inline-flex items-center gap-[2px] text-gray-500 cursor-pointer hover:text-purple-700'>
                <svg className='w-4 h-4' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                {label}
            </span>
        </Link>
    )
}

export default memo(Back)
