import Back from '@/components/back/back'
import ArticlePreview from '@/features/article-preview/article-preview'
import Categories from '@/features/categories/categories'
import MainLayout from '@/layouts/main'
import { contentApi, useGetNewsArticleQuery } from '@/services/content/api'
import { TStore, wrapper } from '@/services/store'
import { isArrayOfStrings } from '@/types/type-guards'
import { getArticleIdFromPath, toStatic } from '@/utils/utils'
import { GetStaticPropsContext } from 'next'
import Image from 'next/image'
import { FC, ReactNode } from 'react'

interface INewsArticleProps {
    query: { id: number }
}

const NewsArticle: FC<INewsArticleProps> = ({
    query
}) => {
    const { data: newsArticle } = useGetNewsArticleQuery(query)
    const { name, short_text, createdAt, categories, full_text, img, author } = newsArticle || {}

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-3'>
                    <Back link='/content/news' label='К новостям' />
                    <div className=' grid grid-cols-6 gap-6'>
                        <div className='flex flex-col gap-5 col-span-6 md:col-span-4'>
                            <div className='flex justify-between flex-wrap max-md:gap-4'>
                                <div className='flex items-baseline gap-1 md:gap-3 max-sm:flex-wrap'>
                                    <span className='font-bold text-base'>{name}</span>
                                    <span className='text-gray-400 text-sm'>{new Date(createdAt).toLocaleString()}</span>
                                </div>
                                <Categories categories={categories} />
                            </div>
                            <p>{short_text}</p>
                            <div className=' rounded-lg overflow-hidden relative h-96'>
                                <Image
                                    src={toStatic(isArrayOfStrings(img) ? img[0] : img)}
                                    unoptimized
                                    style={{ objectFit: 'cover' }}
                                    fill
                                    alt={name}
                                />
                            </div>
                            <p dangerouslySetInnerHTML={{ __html: full_text }}></p>
                        </div>
                        <div className='col-span-6 pt-4 flex flex-col gap-5'>
                            <span className='font-bold text-base'>Рекомендуем вам</span>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                                <ArticlePreview
                                    img={img}
                                    title={name}
                                    link={'/hihihiih'}
                                    categories={categories}
                                />
                                <ArticlePreview
                                    img={img}
                                    title={name}
                                    link={'/hihihiih'}
                                    categories={categories}
                                />
                                <ArticlePreview
                                    img={img}
                                    title={name}
                                    link={'/hihihiih'}
                                    categories={categories}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(
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


// export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" })


// @ts-ignore
NewsArticle.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default NewsArticle
