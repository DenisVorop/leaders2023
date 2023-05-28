import NewsCard from '@/features/news-card/news-card'
import MainLayout from '@/layouts/main'
import { TStore, wrapper } from '@/services/store'
import { GetStaticPropsContext } from 'next'
import { FC, ReactNode, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'
import ProfileProgress from '@/features/profile-progress/profile-progress'
import { hardcodeDepartments, hardcodeDepartmentsBadges } from '../../utils/hardcodeDeparments'
import Image, { StaticImageData } from 'next/image'

const Chat = dynamic(() => import("@/components/realtime/chat"), { ssr: false })

const Dashboard: FC = () => {
    const [department, setDepartment] = useState(hardcodeDepartmentsBadges[0])

    const selectedDepartment = useMemo(() => {
        return hardcodeDepartments.find(dep => dep.id === department.id)
    }, [department.id])

    return (
        <div>
            <div className='custom-container'>
                <div className='grid grid-cols-6 gap-6'>
                    <div className=' col-span-2 flex flex-col gap-6'>
                        <ProfileProgress />
                        <NewsCard />
                    </div>
                    <div className='col-span-4'>
                        <div className='card h-full flex flex-col gap-5 relative overflow-hidden'>
                            <span className='text-gray-400 font-medium text-xs uppercase'>
                                Про стажировку в правительстве Москвы
                            </span>
                            <div className='flex flex-col gap-5 h-full'>
                                <div className='grid grid-cols-3 gap-4'>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1'>
                                        <span className=' font-bold text-4xl'>2300</span>
                                        <span className=' text-xs text-gray-700'>человек прошли стажировку с 2016 года</span>
                                    </div>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1'>
                                        <span className=' font-bold text-4xl'>600</span>
                                        <span className=' text-xs text-gray-700'>человек проходят стажировку прямо сейчас</span>
                                    </div>
                                    <div className='card bg-white px-6 py-6 flex flex-col gap-1'>
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
                                <div className='card bg-white max-w-[542px] p-6 rounded-br-lg flex flex-col gap-3 text-sm'>
                                    <span className=' text-base font-bold'>{selectedDepartment.title}</span>
                                    <p>{selectedDepartment.description}</p>
                                    <span>Стажировка в <span className='text-purple-600 cursor-pointer hover:text-purple-800'>{selectedDepartment.department}</span></span>
                                </div>
                                <div className='flex flex-col gap-2 items-end max-w-[450px] mt-auto'>
                                    <span className=' font-semibold'>{selectedDepartment.name}</span>
                                    <span className='text-end text-xs text-gray-700 max-w-[268px]'>{selectedDepartment.jobTitle}</span>
                                </div>
                                <div className='absolute bottom-[-85px] right-[-40px] z-[-1]'>
                                    <DepartmentImage img={selectedDepartment.img} />
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
}
const DepartmentImage: FC<IDepartmentImageProps> = ({
    img,
}) => {
    return (
        <div className='relative h-[432px] w-[432px] rounded-full bg-purple-600 bottom-0 right-0 flex justify-around'>
            <div className='relative w-[382px] h-[524px] mt-[-55px]'>
                <Image src={img} fill alt={'dsds'} style={{ objectFit: 'cover' }} />
            </div>
        </div>
    )
}

// @ts-ignore
Dashboard.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {

        return {
            props: {
            }
        }
    }
)

export default Dashboard
