import NewsCard from '@/features/news-card/news-card'
import MainLayout from '@/layouts/main'
import { TStore, wrapper } from '@/services/store'
import { GetStaticPropsContext } from 'next'
import { FC } from 'react'

interface IDashboardProps {
}

const Dashboard: FC<IDashboardProps> = () => {
    return (
        <div>
            <div className='custom-container'>
                <div className='grid grid-cols-6 gap-6'>
                    <div className=' col-span-2 flex flex-col gap-6'>
                        <div className='card'></div>
                        <NewsCard />
                    </div>
                    <div className='col-span-4'>
                        <div className='card h-full'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
Dashboard.getLayout = (page: typeof Dashboard) => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {

        return {
            props: {
            }
        }
    }
)

export default Dashboard
