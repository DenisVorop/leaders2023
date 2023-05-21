import { TUserProfile } from '@/types/types'
import { FC, memo } from 'react'

interface IPersonalProps {
    profile: TUserProfile
    session: { email_approved: boolean }
}

const Personal: FC<IPersonalProps> = ({
    profile,
    session,
}) => {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col'>
                <span className=' font-bold'>{profile.surname} {profile.name} {profile.patronymic}</span>
                <span>
                    {session.email_approved
                        ? <span className=' text-sm text-gray-400'>Подтверждённая учётная запись</span>
                        : <span className=' text-sm text-red-400'>Подтвердите учетную запись</span>
                    }
                </span>
            </div>
            <div className='flex flex-col gap-3'>
                <div className=' text-sm flex items-center gap-4'>
                    +7 (915) 224-25-57
                    <span
                        className='text-purple-600 text-sm cursor-pointer'
                    >
                        Изменить
                    </span>
                </div>
                <div className=' text-sm flex items-center gap-4'>
                    kropotovada@hotmail.com
                    <span
                        className='text-purple-600 text-sm cursor-pointer'
                    >
                        Изменить
                    </span>
                </div>
                <div className='text-purple-600 text-sm'>
                    Сменить пароль
                </div>
            </div>
        </div>
    )
}

export default memo(Personal)
