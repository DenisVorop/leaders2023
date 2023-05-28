import Card from '@/components/cards/card'
import SearchInput from '@/components/inputs/search-input'
import ArticlePreview from '@/features/article-preview/article-preview'
import MainLayout from '@/layouts/main'
import { ESortDirections, ESortParams, TContentRequest, contentApi } from '@/services/content/api'
import { initialContentParams, useNews } from '@/services/hooks/use-news'
import { TStore, wrapper } from '@/services/store'
import { changeSortDirection } from '@/utils/utils'
import { Dropdown } from 'flowbite-react'
import { GetStaticPropsContext } from 'next'
import { FC, ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface INewsProps {
    initialContentParams: TContentRequest
}

const helperDirectionFunc = (sortDirection: ESortDirections) => sortDirection === ESortDirections.ASC ? 'по возрастанию' : 'по убыванию'

const sortParams: { label: string, param: ESortParams }[] = [
    {
        param: ESortParams.AUTHOR,
        label: 'автору',
    },
    {
        param: ESortParams.CREATED_AT,
        label: 'дате',
    },
]

const News: FC<INewsProps> = ({
    initialContentParams,
}) => {
    const [newsParams, setNewsParams] = useState(initialContentParams)
    const [newsData] = useNews({ newsParams })
    const { register, getValues } = useForm()

    const handleSearch = useCallback(() => {
        setNewsParams(prev => ({ ...prev, searchQuery: getValues('searchQuery') }))
    }, [getValues])

    const handleSort = useCallback((sortParam: ESortParams) => {
        setNewsParams(prev => {
            if (prev.param === sortParam) {
                return { ...prev, param: sortParam, sortDirection: changeSortDirection(prev.sortDirection) }
            }
            return { ...prev, param: sortParam }
        })
    }, [])

    return (
        <div>
            <div className='custom-container'>
                <div className='flex flex-col gap-6'>
                    <div className=' max-w-md'>
                        <SearchInput
                            onClick={handleSearch}
                            register={register}
                            name='searchQuery'
                        />
                    </div>
                    <div className='card flex flex-col gap-5'>
                        <div className='flex'>
                            <Dropdown label="Выпадающий список">
                                <Dropdown.Header>
                                    Сортировать по
                                </Dropdown.Header>
                                <Dropdown.Divider className="h-[1px]" />
                                {sortParams.map(param =>
                                    <Dropdown.Item
                                        key={param.param}
                                        className={`${newsParams.param === param.param && 'bg-gray-200'}`}
                                        onClick={() => handleSort(param.param)}
                                    >
                                        {param.label} {newsParams.param === param.param && `(${helperDirectionFunc(newsParams.sortDirection)})`}
                                    </Dropdown.Item>
                                )}
                            </Dropdown>
                            - изменить не забыть и если успеть!!
                        </div>
                        <span className=' font-bold text-base'>{(newsData?.total || 0)} новостей</span>
                        <div className='grid grid-cols-3 gap-5'>
                            {newsData?.news?.map(({ id, img, name, short_text, tag, categories, createdAt }) => {
                                return (
                                    <ArticlePreview
                                        key={id}
                                        img={img}
                                        title={name}
                                        link={`/content/news/${tag}`}
                                        categories={categories}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// @ts-ignore
News.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        store.dispatch(contentApi.endpoints.getNews.initiate(initialContentParams));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getNews', initialContentParams));

        return {
            props: {
                initialContentParams,
            }
        }
    }
)

export default News
