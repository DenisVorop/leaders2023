import { TUserProfile } from '@/types/types'
import { FC, memo } from 'react'

interface IDocumentsProps {
    profile: TUserProfile | undefined
}

const Documents: FC<IDocumentsProps> = ({
    profile,
}) => {
    return (
        <div className='flex flex-col gap-6'>
            <span className=' font-bold'>Паспорт</span>
            <div className='flex flex-col gap-3 text-sm'>
                <div className='flex items-center gap-10'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-gray-500'>Серия и номер</span>
                        <span className='font-medium'>{profile?.passport_number}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='text-gray-500'>Выдан</span>
                        <span className='font-medium'>{profile?.issuer.toUpperCase()}</span>
                    </div>
                </div>
                <div className='flex items-center gap-10'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-gray-500'>Дата выдачи</span>
                        <span className='font-medium'>{new Date(profile?.date_of_issue).toLocaleDateString()}</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='text-gray-500'>Код подразделения</span>
                        <span className='font-medium'>{profile?.subdivision_code}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Documents)
