import { TUserProfile } from '@/types/types'
import { FC, memo } from 'react'
import { IExperienceData } from '../personal-form/steps/experience-step'

interface IExperienceProps {
    experience: (IExperienceData & { experience_id: number })[]
}

const Experience: FC<IExperienceProps> = ({
    experience,
}) => {
    console.log(experience)
    return (
        <div className='flex flex-col gap-6'>
            <span className=' font-bold'>Опыт работы</span>
            <div className='flex flex-col gap-6'>
                {experience.map((exp, index, array) => {
                    return (
                        <div key={exp.experience_id} className='flex flex-col gap-4'>
                            {array.length > 1 &&
                                <div className=' text-xs text-gray-400'>{index + 1} МЕСТО РАБОТЫ</div>
                            }
                            <div className='flex items-center gap-10 text-sm'>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-gray-500'>Место работы</span>
                                    <span className='font-medium'>{exp.place}</span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-gray-500'>Должность</span>
                                    <span className='font-medium'>{exp.position}</span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span className='text-gray-500'>Продолжительность </span>
                                    <span className='font-medium'>{exp.duration}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(Experience)
