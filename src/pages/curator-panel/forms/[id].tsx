import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import Divider from '@/components/divider/divider'
import Spinner from '@/components/spinner/spinner'
import CuratorHeader from '@/features/header/curator-header'
import Popup from '@/features/popup/popup'
import Documents from '@/features/profile/documents'
import Education from '@/features/profile/education'
import Experience from '@/features/profile/experience'
import Personal from '@/features/profile/personal'
import { useGetAllProfiles } from '@/hooks/get-all-profiles'
import { useErrorProcessing } from '@/hooks/use-error-processing'
import MainLayout from '@/layouts/main'
import { useApproveUserFormMutation } from '@/services/profile/api'
import { wrapper, TStore } from '@/services/store'
import { EProfileStatuses } from '@/types/enums'
import { GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import { FC, useMemo, ReactNode, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

interface IFormProps {
    profileId: number
}

const Form: FC<IFormProps> = ({ profileId }) => {
    const [allProfiles] = useGetAllProfiles()
    const [approveForm, { isSuccess, isError }] = useApproveUserFormMutation()
    const { register, handleSubmit, reset } = useForm({ defaultValues: { comment: '', status: EProfileStatuses.DECLINED } })
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useErrorProcessing(isSuccess, 'success', 'Статус анкеты изменен', () => {
        reset()
        router.push('/curator-panel/forms')
    })
    useErrorProcessing(isError, 'danger')

    const handleApprove = (data: { status: EProfileStatuses.APPROVED | EProfileStatuses.DECLINED, comment: string }) => {
        const bool = confirm(`Вы уверены, что хотите ююю анкету?`)

        if (!bool) return

        approveForm({
            email: 'aa@test.ru',
            status: data?.status,
            comment: data?.comment || '',
        })
    }

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
        <>
            <div>
                <div className='custom-container'>
                    <div className='card flex flex-col gap-4'>
                        <div className=' flex justify-between'>
                            <Breadcrumbs paths={paths} />
                            <div className='flex items-center gap-2'>
                                <button
                                    className='button bg-red-600 hover:bg-red-700'
                                    onClick={() => setOpen(true)}
                                >
                                    Отклонить
                                </button>
                                <button
                                    className='button'
                                    onClick={() => handleApprove({ comment: 'Добро пожаловать на платформу!', status: EProfileStatuses.APPROVED })}
                                >
                                    Одобрить
                                </button>
                            </div>
                        </div>
                        <div className='text-lg font-bold'>Информация о пользователе</div>
                        <Divider className='my-0' />
                        <div className='flex'>
                            <Personal profile={profile} />
                            <Divider className=' mx-4' vertical />
                            <Documents profile={profile} />
                        </div>
                        <Divider className=' my-0' />
                        <div className='flex'>
                            <Education profile={profile} />
                            <Divider className=' mx-4' vertical />
                            <Experience experience={experience} />
                        </div>
                    </div>
                </div>
            </div>
            <Popup isVisible={open} onClose={() => {
                setOpen(false)
                reset()
            }}
                className='flex flex-col w-96 gap-4'
            >
                <div>
                    <span className='label text-lg font-bold'>Причина отказа</span>
                    <textarea
                        className='textarea'
                        {...register('comment', { required: false })}
                    />
                </div>
                <button
                    onClick={handleSubmit(handleApprove)}
                    className='button bg-red-600 hover:bg-red-700'
                >
                    Отклонить анкету
                </button>
            </Popup>
        </>
    )
}

// @ts-ignore
Form.getLayout = (page: ReactNode) => <MainLayout header={<CuratorHeader />}>{page}</MainLayout>

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
