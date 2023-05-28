import SearchInput from '@/components/inputs/search-input'
import DragNDrop from '@/features/drag-n-drop/drag-n-drop'
import Popup from '@/features/popup/popup'
import ProjectCard from '@/features/project-card/project-card'
import ResponseProject from '@/features/response-project/response-project'
import MainLayout from '@/layouts/main'
import { useGetRespondedProjectsQuery } from '@/services/content/actions-api'
import { ESortDirections, ESortParams, TContentRequest, TProject, contentApi, useGetProjectsQuery } from '@/services/content/api'
import { initialContentParams, useNews } from '@/services/hooks/use-news'
import { TStore, wrapper } from '@/services/store'
import { changeSortDirection, toProject } from '@/utils/utils'
import { Dropdown } from 'flowbite-react'
import { GetStaticPropsContext } from 'next'
import Link from 'next/link'
import { FC, ReactNode, useCallback, useState } from 'react'
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
    const { data: projectsData } = useGetProjectsQuery(projectParams)
    const { data: respondedData } = useGetRespondedProjectsQuery(null)

    const [respondedProjectsIdx] = respondedData || []

    const { register, getValues } = useForm()
    const [selectedProject, setSelectedProject] = useState<TProject | null>(null)

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

    const [open, setOpen] = useState(false)

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
                    <div className='card bg-white-opacity flex flex-col gap-5'>
                        <div className='flex'>
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
                            - изменить не забыть и если успеть!!
                        </div>
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
                            {projectsData?.projects?.map((project) => {
                                return (
                                    <Link
                                        key={project.id}
                                        href={toProject(project.tag)}
                                        className='h-full'
                                    >
                                        <ProjectCard
                                            onClick={(project) => {
                                                setSelectedProject(project)
                                                setOpen(true)
                                            }}
                                            isResponded={respondedProjectsIdx?.includes(project.id)}
                                            {...project}
                                        />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                    <Popup
                        isVisible={open}
                        onClose={() => setOpen(false)}
                        className='mt-[-10%]'
                    >
                        <div className='flex flex-col gap-5 max-w-[496px]'>
                            <ResponseProject
                                project={selectedProject}
                                onClose={() => setOpen(false)}
                            />
                        </div>
                    </Popup>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
Projects.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

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
