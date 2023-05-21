import useReadSessionStorage from '@/hooks/use-read-session-storage'
import { FC, memo } from 'react'
import { ESteps } from '../stepper'
import { IPersonalData } from './personal-data-step'
import { IPassportData } from './passport-data-step'
import { IEducationData } from './education-step'
import { IExperienceData } from './experience-step'
import { SetValue } from '@/hooks/use-session-storage'

interface ISendedStepProps {
    setStep: SetValue<number>
}

const SendedStep: FC<ISendedStepProps> = ({ setStep }) => {
    const personalData = useReadSessionStorage<IPersonalData>(ESteps.PERSONAL)
    const passportData = useReadSessionStorage<IPassportData>(ESteps.PASSPORT)
    const educationData = useReadSessionStorage<IEducationData>(ESteps.EDUCATION)
    const experienceData = useReadSessionStorage<IExperienceData>(ESteps.EXPERIENCE)
    return (
        <div className='flex flex-col gap-6'>
            <div>
                {JSON.stringify([personalData, passportData, educationData, experienceData])}
            </div>
            <div>
                <button
                    className='button'
                    onClick={() => setStep(prev => --prev)}
                >
                    Назад
                </button>
                Ура заявка отправлена, жди пупсик
            </div>
        </div>
    )
}

export default memo(SendedStep)
