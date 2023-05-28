import NewsCard from '@/features/news-card/news-card'
import MainLayout from '@/layouts/main'
import { TStore, wrapper } from '@/services/store'
import { GetStaticPropsContext } from 'next'
import { FC, ReactNode, useMemo, useState } from 'react'

import ProfileProgress from '@/features/profile-progress/profile-progress'
import { hardcodeDepartments, hardcodeDepartmentsBadges } from '../../utils/hardcodeDeparments'
import Image, { StaticImageData } from 'next/image'
import { contentApi } from '@/services/content/api'
import { initialContentParams } from '@/services/hooks/use-news'

const Dashboard: FC<{ params: typeof initialContentParams }> = ({ params }) => {
    const [department, setDepartment] = useState(hardcodeDepartmentsBadges[0])

    const selectedDepartment = useMemo(() => {
        return hardcodeDepartments.find(dep => dep.id === department.id)
    }, [department.id])

    return (
        <div>
            <div className='custom-container'>
                <div className='grid grid-cols-6 gap-6'>
                    <div className='col-span-6 xl:col-span-2 flex flex-col gap-6'>
                        <ProfileProgress />
                        <NewsCard params={params} />
                    </div>
                    <div className='col-span-6 xl:col-span-4'>
                        <div className='card h-full flex flex-col gap-5 relative overflow-hidden'>
                            <span className='text-gray-400 font-medium text-xs uppercase'>
                                Про стажировку в правительстве Москвы
                            </span>
                            <div className='flex flex-col gap-5 h-full'>
                                <div className='flex flex-wrap md:grid grid-cols-3 gap-4'>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1 w-full'>
                                        <span className=' font-bold text-4xl'>2300</span>
                                        <span className=' text-xs text-gray-700'>человек прошли стажировку с 2016 года</span>
                                    </div>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1 w-full'>
                                        <span className=' font-bold text-4xl'>600</span>
                                        <span className=' text-xs text-gray-700'>человек проходят стажировку прямо сейчас</span>
                                    </div>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1 w-full'>
                                        <span className=' font-bold text-4xl'>100 000 ₽</span>
                                        <span className=' text-xs text-gray-700'>средняя заработная плата после стажировки</span>
                                    </div>
                                </div>
                                <div className='flex flex-nowrap gap-2 overflow-x-scroll'>
                                    {hardcodeDepartmentsBadges.map((departmentBadge) => {
                                        return <span
                                            className={`badge whitespace-nowrap cursor-pointer ${department.id === departmentBadge.id ? 'badge-purple' : ''}`}
                                            key={departmentBadge.id}
                                            onClick={() => setDepartment(departmentBadge)}
                                        >
                                            {departmentBadge.badge}
                                        </span>
                                    })}
                                </div>
                                <div className='card bg-white max-w-full md:max-w-[542px] p-6 rounded-br-lg flex flex-col gap-3 text-sm'>
                                    <span className=' text-base font-bold'>{selectedDepartment.title}</span>
                                    <p>{selectedDepartment.description}</p>
                                    <span>Стажировка в
                                        <span className='text-purple-600 cursor-pointer hover:text-purple-800'>
                                            {selectedDepartment.department}
                                        </span>
                                    </span>
                                </div>
                                <div className='flex flex-col-reverse md:flex-col gap-5'>
                                    <div className='flex flex-col gap-2 items-start md:items-end max-w-full md:max-w-[450px] mt-auto'>
                                        <span className=' font-semibold'>{selectedDepartment.name}</span>
                                        <span className='text-start md:text-end text-xs text-gray-700 max-w-[268px]'>{selectedDepartment.jobTitle}</span>
                                    </div>
                                    <div className='static md:absolute bottom-[-85px] right-[-40px] z-[-1]'>
                                        <DepartmentImage
                                            alt={selectedDepartment?.name}
                                            img={selectedDepartment?.img}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface IDepartmentImageProps {
    img: StaticImageData
    alt: string
}
const DepartmentImage: FC<IDepartmentImageProps> = ({
    img,
    alt,
}) => {
    return (
        <div className='relative h-full sm:h-[332px] sm:w-[332px]  md:h-[432px] md:w-[432px] rounded-full bg-purple-600 bottom-0 right-0 flex justify-around overflow-hidden md:overflow-visible'>
            <div className='relative w-[180px] h-[240px] sm:w-[232px] sm:h-[300px] mb-[-40px] sm:mt-[55px] md:w-[382px] md:h-[524px] md:mt-[-55px]'>
                <Image src={img} fill alt={alt} style={{ objectFit: 'cover' }} />
            </div>
        </div>
    )
}

// @ts-ignore
Dashboard.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        const params = { ...initialContentParams, limit: 5 }
        store.dispatch(contentApi.endpoints.getNews.initiate(params));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getNews', params));

        return {
            props: {
                params,
            }
        }
    }
)

export default Dashboard
