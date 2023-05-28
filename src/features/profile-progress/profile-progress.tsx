import ProgressBar from '@/components/progress-bar/progress-bar'
import { useGetProfileQuery } from '@/services/profile/api'
import { useGetTestResultQuery } from '@/services/test-cases/api'
import { EProfileStatuses } from '@/types/enums'
import { useRouter } from 'next/router'
import { FC, memo, useMemo } from 'react'

const ProfileProgress: FC = () => {
    const router = useRouter()

    const { data: testResult, isLoading: isLoadingTestResult } = useGetTestResultQuery(null)
    const { data: profileData, isLoading: isLoadingProfileData } = useGetProfileQuery(null)

    const [percent, path] = useMemo(() => {
        let percent = 25
        let path = '/personal-form'
        const hasProfile = !isLoadingProfileData && !!profileData
        const hasTestResult = !isLoadingTestResult && !!testResult

        if (hasProfile) {
            percent += 25
            path = '/test-cases'
        }

        if (hasTestResult) {
            percent += 25
            path = ''
        }

        if (profileData?.status) {
            percent += 25
            path = '/content/projects'
        }

        return [percent, path]
    }, [isLoadingProfileData, isLoadingTestResult, profileData, testResult])

    return (
        <div className='card flex flex-col gap-5'>
            <span className='text-gray-400 font-medium text-xs uppercase'>Прогресс</span>
            <div className='flex flex-col gap-2'>
                <span className=' font-semibold'>Скоро вы сможете найти стажировку</span>
                <div className='flex flex-col gap-2'>
                    <div className=' flex items-baseline justify-between gap-2'>
                        <span className='text-gray-700 text-xs'>Заполнение профиля</span>
                        <span className='text-gray-500 text-xs font-medium'>{percent}%</span>
                    </div>
                    <ProgressBar percent={percent} />
                </div>
            </div>

            <button
                className='button w-full'
                disabled={!path}
                onClick={() => router.push(path)}
            >
                {percent === 25 && 'Заполнить личные данные'}
                {percent === 50 && 'Пройти тестирование'}
                {percent === 75 && 'Анкета на проверке'}
                {percent === 100 && 'К стажировкам'}
            </button>
        </div>
    )
}

export default memo(ProfileProgress)
