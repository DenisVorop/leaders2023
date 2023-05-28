import { TUserProfile } from '@/types/types'
import { FC, memo } from 'react'

interface IPersonalProps {
    profile: TUserProfile | undefined
    session?: { email_approved: boolean }
}

const Personal: FC<IPersonalProps> = ({
    profile,
    session,
}) => {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col'>
                <span className=' font-bold'>{profile?.surname} {profile?.name} {profile?.patronymic}</span>
                {session
                    ? <span>
                        {session.email_approved
                            ? <span className=' text-sm text-gray-400'>Подтверждённая учётная запись</span>
                            : <span className=' text-sm text-red-400'>Подтвердите учетную запись</span>
                        }
                    </span>
                    : null
                }
            </div>
            <div className='flex flex-col gap-3'>
                <div className=' text-sm flex items-center gap-1 md:gap-4 flex-wrap'>
                    <svg className='h-5' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {profile?.contact || 'Вы не указали номер телефона'}
                    {session &&
                        <span className='text-purple-600 text-sm cursor-pointer'>Изменить</span>
                    }
                </div>
                <div className=' text-sm flex items-center gap-1 md:gap-4 flex-wrap'>
                    <svg className='h-5' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {profile?.email}
                    {session &&
                        <span className='text-purple-600 text-sm cursor-pointer'>Изменить</span>
                    }
                </div>
                {session &&
                    <div className='text-purple-600 text-sm'>
                        Сменить пароль
                    </div>
                }
            </div>
        </div>
    )
}

export default memo(Personal)
