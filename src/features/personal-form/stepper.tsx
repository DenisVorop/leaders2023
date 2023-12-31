import { FC, memo } from 'react'
import { useSessionStorage } from '@/hooks/use-session-storage'
import { PassportDataStep, PersonalDataStep, EducationDataStep, ExperienceDataStep, SendedDataStep } from './steps'
import Link from 'next/link'
import useReadSessionStorage from '@/hooks/use-read-session-storage'
import { IEducationData } from './steps/education-step'
import { IExperienceData } from './steps/experience-step'
import { IPassportData } from './steps/passport-data-step'
import { IPersonalData } from './steps/personal-data-step'
import Back from '@/components/back/back'


// CREATE TABLE IF NOT EXISTS profiles(
//     id                  serial primary key,
//     email               text not null,

//     source              text not null,
//     contact             text,
//     text                text,
//     create_at           timestamp default now(),
//     update_at           timestamp default null
// );

interface IStepperProps { }

export enum ESteps {
    PERSONAL = 'personal-data-step',
    PASSPORT = 'passport-data-step',
    EDUCATION = 'education-data-step',
    EXPERIENCE = 'experience-data-step',
}

const Stepper: FC<IStepperProps> = () => {
    const [step, setStep] = useSessionStorage('step', 0)

    const personalData = useReadSessionStorage<IPersonalData>(ESteps.PERSONAL)
    const passportData = useReadSessionStorage<IPassportData>(ESteps.PASSPORT)
    const educationData = useReadSessionStorage<IEducationData>(ESteps.EDUCATION)
    const experienceData = useReadSessionStorage<IExperienceData[]>(ESteps.EXPERIENCE)

    const isDoneSvg = <svg aria-hidden="true" className="w-4 h-4 mr-2 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    const isDoneClass = 'text-purple-600 dark:text-purple-500'

    return (
        <div className='card flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                <Back />
                <h1 className='text-gray-900 text-xl'>Анкета</h1>
            </div>

            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base max-md:flex-wrap">
                <li className={`${step >= 0 && isDoneClass} flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                        {step > 0 ? isDoneSvg : <span className="mr-2">1.</span>}
                        Личные <span className="hidden sm:inline-flex sm:ml-2">данные</span>
                    </span>
                </li>
                <li className={`${step >= 1 && isDoneClass} flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                        {step > 1 ? isDoneSvg : <span className="mr-2">2.</span>}
                        Паспортные <span className="hidden sm:inline-flex sm:ml-2">данные</span>
                    </span>
                </li>
                <li className={`${step >= 2 && isDoneClass} flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                        {step > 2 ? isDoneSvg : <span className="mr-2">3.</span>}
                        Образование
                    </span>
                </li>
                <li className={`${step >= 3 && isDoneClass} flex items-center`}>
                    {step > 3 ? isDoneSvg : <span className="mr-2">4.</span>}
                    Опыт <span className="hidden sm:inline-flex sm:ml-2">работы</span>
                </li>
            </ol>

            {step === 0 && <PersonalDataStep setStep={setStep} />}
            {step === 1 && <PassportDataStep setStep={setStep} />}
            {step === 2 && <EducationDataStep setStep={setStep} />}
            {step === 3 && <ExperienceDataStep setStep={setStep} />}
            {step === 4 &&
                <SendedDataStep
                    personalData={personalData}
                    passportData={passportData}
                    educationData={educationData}
                    experienceData={experienceData}
                />
            }
        </div>
    )
}

export default memo(Stepper)
