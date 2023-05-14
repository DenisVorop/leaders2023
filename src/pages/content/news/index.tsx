import Card from '@/components/cards/card'
import Dropdown from '@/components/dropdown/dropdown'
import DropdownItem from '@/components/dropdown/dropdown-item'
import SearchInput from '@/components/inputs/search-input'
import { TNewsRequest, contentApi } from '@/services/content/api'
import { initialNewsParams, useNews } from '@/services/hooks/use-news'
import { TStore, wrapper } from '@/services/store'
import { GetStaticPropsContext } from 'next'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface INewsProps {
    initialNewsParams: TNewsRequest
}

const News: FC<INewsProps> = ({
    initialNewsParams,
}) => {
    const [newsParams, setNewsParams] = useState(initialNewsParams)
    const [newsData] = useNews({ newsParams })
    const { register, getValues } = useForm()

    const handleSearch = useCallback(() => {
        setNewsParams(prev => ({ ...prev, searchQuery: getValues('searchQuery') }))
    }, [getValues])

    return (
        <div className='flex flex-col gap-[64px]'>
            <SearchInput
                onClick={handleSearch}
                register={register}
                name='searchQuery'
            />
            <Dropdown label="Выпадающий список">
                {[1, 2, 3, 4, 5].map(i =>
                    <DropdownItem key={i}>
                        <div onClick={e => console.log('click')}>
                            {i}
                        </div>
                    </DropdownItem>
                )}
            </Dropdown>
            <div className='flex gap-[32px]'>
                {newsData.news.map((item) => {
                    return (
                        <Card
                            key={item.createdAt}
                            img={item.img}
                            title={item.name}
                            short_text={item.short_text}
                            link={item.tag}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        store.dispatch(contentApi.endpoints.getNews.initiate(initialNewsParams));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getNews', initialNewsParams));

        return {
            props: {
                initialNewsParams,
            }
        }
    }
)

export default News
