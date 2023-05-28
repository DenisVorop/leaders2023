import Divider from '@/components/divider/divider'
import MainLayout from '@/layouts/main'
import { useGetRespondedProjectsQuery } from '@/services/content/actions-api'
import { PORTS } from '@/utils/paths'
import { openLinkInNewWindow } from '@/utils/utils'
import { FC, Fragment, ReactNode } from 'react'

const RespondedProjects: FC = () => {
    const { data: respondedProjectsData } = useGetRespondedProjectsQuery(null)
    const [, respondedProjects] = respondedProjectsData || []

    return (
        <div>
            <div className='custom-container'>
                <div className='card'>
                    {respondedProjects?.map((project) => {
                        return (
                            <Fragment key={project.id}>
                                <div className='flex flex-col gap-2'>
                                    <span>Вакансия #{project?.project_id}</span>
                                    <span>Прикрепленный файл - <span
                                        className='text-purple-600 hover:text-purple-700 cursor-pointer'
                                        onClick={() => openLinkInNewWindow(`https://mycareer.fun/${PORTS.actions_port}/project/file/${project?.file}`)}
                                    >
                                        {project?.file}</span>
                                    </span>
                                    <span>Статус - {project?.status}</span>
                                </div>
                                <Divider className='my-4 bg-purple-600' />
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
RespondedProjects.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default RespondedProjects
