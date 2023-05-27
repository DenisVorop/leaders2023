import { isArrayOfStrings } from '@/types/type-guards'
import { toStatic } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Categories from '../categories/categories'

interface IArticlePreviewProps {
    img: string | string[]
    title: string
    link: string
    categories?: string[]
}

const ArticlePreview: React.FC<IArticlePreviewProps> = ({
    img,
    title,
    link,
    categories,
}) => {
    return (
        <Link href={link} className=' rounded-lg overflow-hidden'>
            <div className='flex relative h-[200px]'>
                {!isArrayOfStrings(img) && img &&
                    <div className=' absolute top-0 left-0 right-0 bottom-0'>
                        <Image
                            src={toStatic(img)}
                            fill
                            style={{ objectFit: 'cover' }}
                            alt={title}
                            unoptimized
                        />
                    </div>
                }
                <div
                    className='flex flex-col gap-3 px-4 py-4 relative flex-1'
                    style={{ background: 'linear-gradient(359.37deg, rgba(0, 0, 0, 0.8) 23.09%, rgba(0, 0, 0, 0) 99.37%)' }}
                >
                    <Categories categories={categories} />
                    <h3 className='font-bold text-xl text-gray-50 mt-auto'>{title}</h3>
                </div>
            </div>
        </Link>
    )
}

export default React.memo(ArticlePreview)
