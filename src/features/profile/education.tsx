import { TUserProfile } from '@/types/types'
import { FC, memo } from 'react'

interface IEducationProps {
    profile: TUserProfile | undefined
}

const Education: FC<IEducationProps> = ({
    profile,
}) => {
    return (
        <div className='flex flex-col gap-6'>
            <span className=' font-bold'>Образование</span>
            <div className='flex flex-col gap-3 text-sm'>
                <div className='flex flex-col gap-2'>
                    <span className='text-gray-500'>Уровень образования</span>
                    <span className='font-medium'>{profile?.education}</span>
                </div>
                <div className='flex flex-col gap-2'>
                    <span className='text-gray-500'>Университет</span>
                    <span className='font-medium'>{profile?.university}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(Education)
