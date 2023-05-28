import ProgressBar from '@/components/progress-bar/progress-bar'
import { FC, memo } from 'react'

interface IProfileProgressProps { }

const ProfileProgress: FC<IProfileProgressProps> = () => {
    return (
        <div className='card flex flex-col gap-5'>
            <span className='text-gray-400 font-medium text-xs uppercase'>Прогресс</span>
            <div className='flex flex-col gap-2'>
                <span className=' font-semibold'>Скоро вы сможете найти стажировку</span>
                <div className='flex flex-col gap-2'>
                    <div className=' flex items-baseline justify-between gap-2'>
                        <span className='text-gray-700 text-xs'>Заполнение профиля</span>
                        <span className='text-gray-500 text-xs font-medium'>25%</span>
                    </div>
                    <ProgressBar percent={25} />
                </div>
            </div>

            <button
                className='button w-full'
            >
                Заполнить личные данные
            </button>
        </div>
    )
}

export default memo(ProfileProgress)
