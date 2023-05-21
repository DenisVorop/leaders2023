import Card from '@/components/cards/card'
import SearchInput from '@/components/inputs/search-input'
import ProjectCard from '@/features/project-card/project-card'
import MainLayout from '@/layouts/main'
import { ESortDirections, ESortParams, TContentRequest, contentApi, useGetProjectsQuery } from '@/services/content/api'
import { initialContentParams, useNews } from '@/services/hooks/use-news'
import { TStore, wrapper } from '@/services/store'
import { changeSortDirection } from '@/utils/utils'
import { Dropdown } from 'flowbite-react'
import { GetStaticPropsContext } from 'next'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

const quickFilters = [
    { name: '20 часов в неделю' },
    { name: '40 часов в неделю' },
    { name: 'Москва' },
    { name: 'Сначала новые' },
    { name: 'Сначала старые' },
    { name: 'Избранные' },
    { name: 'Скрытые' },
]

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

const Projects: FC<INewsProps> = ({
    initialContentParams,
}) => {
    const [projectParams, setNewsParams] = useState(initialContentParams)
    const { data } = useGetProjectsQuery(projectParams)
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
                                className={`${projectParams.param === param.param && 'bg-gray-200'}`}
                                onClick={() => handleSort(param.param)}
                            >
                                {param.label} {projectParams.param === param.param && `(${helperDirectionFunc(projectParams.sortDirection)})`}
                            </Dropdown.Item>
                        )}
                    </Dropdown>
                    <div className='card bg-white-opacity flex flex-col gap-5'>
                        <div className='flex items-center gap-5'>
                            <div className=' font-bold text-base'>230 подходящих стажировок</div>
                            <div className='flex items-center gap-2'>{quickFilters.map((filter, index) =>
                                <span
                                    key={index}
                                    className={`${!index ? 'badge-purple bg-purple-200' : 'badge'} cursor-pointer hover:text-purple-600`}
                                >
                                    {filter.name}
                                </span>
                            )}
                            </div>
                            <div className='ml-auto text-xs px-3 py-1 bg-purple-500 text-white rounded-md flex gap-1 items-center'>
                                <svg className=' h-4' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                                </svg>
                                Расширенные фильтры
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            {data.projects.map((project) => {
                                return (
                                    <ProjectCard
                                        key={project.id}
                                        {...project}
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
Projects.getLayout = page => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        store.dispatch(contentApi.endpoints.getProjects.initiate(initialContentParams));
        await store.dispatch(contentApi.util.getRunningQueryThunk('getProjects', initialContentParams));

        return {
            props: {
                initialContentParams,
            }
        }
    }
)

export default Projects
