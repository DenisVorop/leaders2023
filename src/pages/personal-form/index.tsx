import Spinner from '@/components/spinner/spinner'
import Stepper from '@/features/personal-form/stepper'
import { useErrorProcessing } from '@/hooks/use-error-processing'
import MainLayout from '@/layouts/main'
import { useGetProfileQuery } from '@/services/profile/api'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

interface IPersonalFormProps { }

const PersonalForm: FC<IPersonalFormProps> = () => {
    const { data: profile, isLoading, isError } = useGetProfileQuery(null)
    const router = useRouter()

    useErrorProcessing(isError, 'danger', 'Произошла ошибка на сервере, мы уже работаем на ее устранением')
    useErrorProcessing(!!profile?.email, 'danger', 'Вы уже заполнили анкету, чтобы изменить ее, перейдите в профиль')

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
