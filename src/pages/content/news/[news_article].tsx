import { contentApi, useGetNewsArticleQuery } from '@/services/content/api'
import { TStore, wrapper } from '@/services/store'
import { isArrayOfStrings } from '@/types/type-guards'
import { getArticleIdFromPath, toStatic } from '@/utils/utils'
import { GetStaticPropsContext } from 'next'
import Image from 'next/image'
import { FC } from 'react'

const participants = [
    {
        name: 'Ефименко Никита',
        login: 'mszx2000',
        level: '88'
    },
    {
        name: 'Ильхам',
        login: 'ilhqm',
        level: '1'
    },
    {
        name: 'Цацина Ангелина',
        login: 'angelina',
        level: '53'
    },
    {
        name: 'Кропотова Дарья',
        login: 'daryakro',
        level: '53'
    },
    {
        name: 'Воропаев Денис',
        login: 'super_mega_ultimate_pro',
        level: '105'
    },
]

interface INewsArticleProps {
    query: { id: number }
}

const NewsArticle: FC<INewsArticleProps> = ({
    query
}) => {
    const { data: newsArticle } = useGetNewsArticleQuery(query)
    const { name, short_text, createdAt, categories, full_text, img, author } = newsArticle

    return (
        <div className="flex flex-col gap-[24px]">

            <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
                    <li className="mr-2">
                        <button id="about-tab" data-tabs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="true" className="inline-block p-4 text-blue-600 rounded-tl-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500">About</button>
                    </li>
                    <li className="mr-2">
                        <button id="services-tab" data-tabs-target="#services" type="button" role="tab" aria-controls="services" aria-selected="false" className="inline-block p-4 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">Services</button>
                    </li>
                    <li className="mr-2">
                        <button id="statistics-tab" data-tabs-target="#statistics" type="button" role="tab" aria-controls="statistics" aria-selected="false" className="inline-block p-4 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">Facts</button>
                    </li>
                </ul>
                <div id="defaultTabContent">
                    <div className="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel" aria-labelledby="about-tab">
                        <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            {name}
                        </h2>
                        <p className="mb-3 text-gray-500 dark:text-gray-400">
                            {short_text}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            дата создания: {new Date(createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="services" role="tabpanel" aria-labelledby="services-tab">
                        <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Организаторы:
                        </h2>
                        <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                            <li className="flex space-x-2">
                                <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                <span className="leading-tight">{author}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
                        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                            <div className="flex flex-col">
                                <dt className="mb-2 text-3xl font-extrabold">73M+</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Developers</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="mb-2 text-3xl font-extrabold">100M+</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Public repositories</dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="mb-2 text-3xl font-extrabold">1000s</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Open source projects</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div className='flex gap-[8px]'>
                {categories?.length
                    ? categories.map(category =>
                        <span key={category} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                            {category}
                        </span>
                    )
                    : null
                }
            </div>

            <p>
                {full_text}
            </p>

            <div className='flex gap-[24px]'>
                <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Участники мероприятия</h5>
                        <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                            Смотреть все
                        </a>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {participants.map(participant => {
                                return (
                                    <li key={participant.login} className="py-3 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {participant.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {participant.login}
                                                </p>
                                            </div>
                                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                                lvl: {participant.level}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className='flex justify-center'>
                    {!isArrayOfStrings(img) && img &&
                        <div className='w-[382px] h-[254px] relative'>
                            <Image
                                src={toStatic(img)}
                                alt={name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    }
                </div>
            </div>

        </div>

    )
}

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        const articleTag = ctx.params.news_article.toString()
        const articleId = getArticleIdFromPath(articleTag)
        const query = { id: articleId }

        store.dispatch(contentApi.endpoints.getNewsArticle.initiate(query));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getNewsArticle', query))
        const { data: newsArticle } = contentApi.endpoints.getNewsArticle.select(query)(store.getState());

        if (!newsArticle?.id || !articleId) {
            return {
                redirect: {
                    statusCode: 301,
                    destination: "/content/news",
                }
            }
        }

        return {
            props: {
                query,
            }
        }
    }
)


export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" })


export default NewsArticle
