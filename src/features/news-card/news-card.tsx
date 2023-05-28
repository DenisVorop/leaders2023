import { initialContentParams, isTNewsData, useNews } from '@/services/hooks/use-news'
import { isArrayOfStrings } from '@/types/type-guards'
import { toStatic } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Slider from '../slider/slider'

interface INewsCardProps { }

const query = { ...initialContentParams, limit: 5 }

const NewsCard: React.FC<INewsCardProps> = () => {
    const [newsData, {isLoading, isError}] = useNews({ newsParams: query })

    const slides = isTNewsData(newsData)
        ? newsData?.news?.map(slide => {
            return (
                <Link key={slide?.id} href={`${`/content/news/${slide?.tag}`}`}>
                    <div className='w-full h-[316px] relative rounded-lg overflow-hidden flex flex-col justify-end px-4 py-4 bg-shadow'>
                        <div className='text-gray-50 text-xl font-bold mb-2'>{slide?.name}</div>
                        <p className=' text-base text-gray-100 h-[68px] overflow-hidden'>{slide?.short_text}...</p>
                        <div className=' absolute w-full h-full top-0 left-0 right-0 bottom-0' style={{ zIndex: '-1' }}>
                            <Image
                                src={toStatic(isArrayOfStrings(slide?.img) ? slide?.img[0] : slide?.img)}
                                fill
                                style={{ objectFit: 'cover' }}
                                alt={slide?.name}
                            />
                        </div>
                    </div>
                </Link>
            )
        })
        : null

    return (
        <div className='card max-w-full flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <div className='uppercase text-gray-400 text-xs'>Новости</div>
                <button className='px-3 py-1 text-xs bg-purple-500 text-purple-50 rounded-md'>
                    <Link href="/content/news">
                        Все новости
                    </Link>
                </button>
            </div>
            {(isLoading || isError)
                ? <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
                    <div className="flex items-center justify-center w-full h-[316px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" /></svg>
                    </div>
                </div>
                : <Slider slides={slides} />
            }
        </div>
    )
}

export default React.memo(NewsCard)
