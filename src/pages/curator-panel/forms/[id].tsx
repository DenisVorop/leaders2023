import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import Divider from '@/components/divider/divider'
import Spinner from '@/components/spinner/spinner'
import Documents from '@/features/profile/documents'
import Education from '@/features/profile/education'
import Experience from '@/features/profile/experience'
import Personal from '@/features/profile/personal'
import { useGetAllProfiles } from '@/hooks/get-all-profiles'
import MainLayout from '@/layouts/main'
import { wrapper, TStore } from '@/services/store'
import { GetStaticPropsContext } from 'next'
import { FC, useMemo, ReactNode } from 'react'

interface IFormProps {
    profileId: number
}

const Form: FC<IFormProps> = ({ profileId }) => {
    const [allProfiles] = useGetAllProfiles()

    const { profile, experience } = useMemo(() => {
        if (!allProfiles.length) return { profile: undefined, experience: undefined }
        return allProfiles.find(({ profile }) => profile.id === profileId)
    }, [allProfiles, profileId])

    const paths = [
        { title: 'Анкеты', url: '/curator-panel/forms' },
        { title: `Анкета #${profileId}` },
    ]

    if (!profile) return <Spinner />

    return (
        <div>
            <div className='custom-container'>
                <div className='card'>
                    <Breadcrumbs paths={paths} />
                    <span className='text-lg font-bold'>Информация о пользователе</span>
                    <Divider className=' my-3' />
                    <div className='flex'>
                        <Personal profile={profile} />
                        <Divider className=' mx-4' vertical />
                        <Documents profile={profile} />
                    </div>
                    <Divider className=' my-4' />
                    <div className='flex'>
                        <Education profile={profile} />
                        <Divider className=' mx-4' vertical />
                        <Experience experience={experience} />
                    </div>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
Form.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        const profileId = ctx.params.id

        return {
            props: {
                profileId: +profileId,
            }
        }
    }
)


export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" })


export default Form
