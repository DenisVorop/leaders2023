import { MouseEvent, FC, memo } from 'react'
import Categories from '../categories/categories'
import { TProject } from '@/services/content/api'
import { openLinkInNewWindow, toStatic } from '@/utils/utils'

interface IProjectCardProps {
    onClick: (project: TProject) => void
    isResponded?: boolean
}

const ProjectCard: FC<IProjectCardProps & TProject> = ({ isResponded, ...project }) => {
    const { categories, organizer, name, onClick, tasks } = project
    return (
        <>
            <div className='card flex flex-col gap-5'>
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <div className='text-purple-600 text-xl font-bold'>{name}</div>
                        <div className='flex gap-2'>
                            <svg className=' h-6 text-gray-400 cursor-pointer' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                            <svg className=' h-6 text-gray-400 cursor-pointer' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                    </div>
                    <Categories categories={categories} />
                </div>
                <div>
                    <div title={organizer}>{organizer?.slice(0, 30)}...<span className='text-gray-400 text-base ml-3'>Москва, Нагатинская</span></div>
                    <div className=' inline-flex gap-2'>
                        <div className='flex items-center gap-1'>
                            4,9
                            <svg className='text-yellow-300 h-6' fill="#FACA15" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </div>
                        <span className='text-gray-400 text-base'>75 отзывов</span></div>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-3 flex-wrap'>
                        {isResponded
                            ? <button
                                className='button w-fit bg-gray-500 hover:bg-gray-500 cursor-not-allowed'
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                }}
                            >
                                Вы уже откликнулись
                            </button>
                            : <button className='button w-fit' onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation()
                                e.preventDefault()
                                onClick(project)
                            }}>
                                Откликнуться
                            </button>
                        }
                        {tasks?.map((task, index) => {
                            return <button
                                key={index}
                                className='button bg-transparent text-purple-600 flex items-center gap-2 border-[1px] border-purple-600 hover:bg-white'
                                onClick={() => openLinkInNewWindow(toStatic(task))}
                            >
                                <svg className='h-5 w-5' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span>Скачать тестовое задание</span>
                            </button>
                        })}
                    </div>
                    <span className=' text-sm text-purple-600'>Откликнулось уже 230 человек</span>
                </div>
            </div>
        </>
    )
}

export default memo(ProjectCard)
