import Back from '@/components/back/back'
import ArticlePreview from '@/features/article-preview/article-preview'
import ProjectCard from '@/features/project-card/project-card'
import MainLayout from '@/layouts/main'
import { contentApi, useGetNewsArticleQuery, useGetProjectArticleQuery } from '@/services/content/api'
import { TStore, wrapper } from '@/services/store'
import { getArticleIdFromPath, openLinkInNewWindow, toStatic } from '@/utils/utils'
import { GetStaticPropsContext } from 'next'
import { FC, ReactNode } from 'react'

interface IProjectArticleProps {
    query: { id: number }
}

const ProjectArticle: FC<IProjectArticleProps> = ({
    query,
}) => {
    const { data: projectArticle } = useGetProjectArticleQuery(query)
    const { name, categories, full_text, img, tasks } = projectArticle || {}

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-3'>
                    <Back link='/content/projects' label='К вакансиям' />
                    <div className=' grid grid-cols-6 gap-5'>
                        <div className='flex flex-col gap-5  col-span-4'>
                            <ProjectCard
                                {...projectArticle}
                                onClick={() => { }}
                            />
                            <div className='card'>
                                <p dangerouslySetInnerHTML={{ __html: full_text }}></p>
                            </div>
                            <div className='flex gap-3 flex-wrap'>
                                <button
                                    className='button'
                                >
                                    Откликнуться
                                </button>
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
                        </div>
                        <div className='col-span-6 pt-4 flex flex-col gap-5'>
                            <span className='font-bold text-base'>Вам подойдут эти вакансии</span>
                            <div className='grid grid-cols-3 gap-5'>
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
        const articleTag = ctx.params.project_article.toString()
        const articleId = getArticleIdFromPath(articleTag)
        const query = { id: articleId }

        store.dispatch(contentApi.endpoints.getProjectArticle.initiate(query));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getProjectArticle', query))
        const { data: projectArticle } = contentApi.endpoints.getProjectArticle.select(query)(store.getState());

        if (!projectArticle?.id || !articleId) {
            return {
                redirect: {
                    statusCode: 301,
                    destination: "/content/projects",
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
ProjectArticle.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default ProjectArticle
