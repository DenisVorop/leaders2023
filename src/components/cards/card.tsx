import { isArrayOfStrings } from '@/types/type-guards'
import { toStatic } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ICardProps {
    img: string | string[]
    title: string
    short_text: string
    link: string
    categories?: string[]
    date?: string
}

const Card: React.FC<ICardProps> = ({
    img,
    title,
    short_text,
    link,
    categories,
    date,
}) => {
    return (
        <div className="flex flex-col max-w-sm bg-white border border-gray-200 rounded-lg overflow-hidden shadow dark:bg-gray-800 dark:border-gray-700">
            {!isArrayOfStrings(img) && img &&
                <div className='w-[382px] h-[254px] relative'>
                    <a href={link}>
                        <Image
                            src={toStatic(img)}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </a>
                </div>
            }
            <div className="p-5 h-full flex-1">
                {categories?.length
                    ? categories.map(category =>
                        <span key={category} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {category}
                        </span>
                    )
                    : null
                }
                <a href={link}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {short_text}
                </p>
                <div className='flex justify-between items-end'>
                    <Link href={link} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Читать
                        <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </Link>
                    <p className="text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:text-gray-300">
                        {new Date(date).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Card)
