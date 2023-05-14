import Card from '@/components/cards/card'
import SearchInput from '@/components/inputs/search-input'
import { ESortDirections, ESortParams, TNewsRequest, contentApi } from '@/services/content/api'
import { initialNewsParams, useNews } from '@/services/hooks/use-news'
import { TStore, wrapper } from '@/services/store'
import { changeSortDirection } from '@/utils/utils'
import { Dropdown } from 'flowbite-react'
import { GetStaticPropsContext } from 'next'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface INewsProps {
    initialNewsParams: TNewsRequest
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
    initialNewsParams,
}) => {
    const [newsParams, setNewsParams] = useState(initialNewsParams)
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
        <div className='flex flex-col gap-[64px]'>
            <SearchInput
                onClick={handleSearch}
                register={register}
                name='searchQuery'
            />
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
            <div className='flex gap-[32px]'>
                {newsData.news.map(({ id, img, name, short_text, tag, categories, createdAt }) => {
                    return (
                        <Card
                            key={id}
                            img={img}
                            title={name}
                            short_text={short_text}
                            link={`/content/news/${tag}`}
                            categories={categories}
                            date={createdAt}
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
