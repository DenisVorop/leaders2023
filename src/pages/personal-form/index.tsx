import Spinner from '@/components/spinner/spinner'
import Stepper from '@/features/personal-form/stepper'
import MainLayout from '@/layouts/main'
import { useNotify } from '@/services/notification/zustand'
import { useGetProfileQuery } from '@/services/profile/api'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

interface IPersonalFormProps { }

const PersonalForm: FC<IPersonalFormProps> = () => {
    const { data: profile, isLoading, isError } = useGetProfileQuery(null)
    const [notify] = useNotify()
    const router = useRouter()

    useEffect(() => {
        if (!isError) return

        notify({
            type: 'danger',
            delay: 5_000,
            content: () =>
                <div>
                    Произошла ошибка на сервере, мы уже работаем на ее устранением
                </div>
        })
        router.push('/dashboard')
    }, [isError])


    useEffect(() => {
        if (!profile?.email) return

        notify({
            type: 'success',
            delay: 5_000,
            content: () =>
                <div>
                    Вы уже заполнили анкету, чтобы изменить ее, перейдите в профиль
                </div>
        })
        router.push('/dashboard')
    }, [profile?.email])

    useEffect(() => {
        return () => {
            sessionStorage.clear()
        }
    }, [])

    if (isLoading) return <Spinner />

    return (
        <div className="custom-container w-full">
            <Stepper />
        </div>
    )
}

// @ts-ignore
PersonalForm.getLayout = page => <MainLayout>{page}</MainLayout>

export default PersonalForm
