import { FC, memo, useEffect, useLayoutEffect } from 'react'
import { IPersonalData } from './personal-data-step'
import { IPassportData } from './passport-data-step'
import { IEducationData } from './education-step'
import { IExperienceData } from './experience-step'
import { useCreateProfileExperienceMutation, useCreateProfileMutation } from '@/services/profile/api'
import { useRouter } from 'next/router'
import { useNotify } from '@/services/notification/zustand'

interface ISendedStepProps {
    personalData: IPersonalData
    passportData: IPassportData
    educationData: IEducationData
    experienceData: IExperienceData[]
}

const SendedStep: FC<ISendedStepProps> = ({
    personalData,
    passportData,
    educationData,
    experienceData,
}) => {
    const router = useRouter()

    const [createProfile] = useCreateProfileMutation()
    const [createProfileExperience] = useCreateProfileExperienceMutation()
    const [notify] = useNotify();

    useLayoutEffect(() => {
        if (
            !personalData || !passportData ||
            !educationData || !experienceData
        ) return

        createProfile({
            name: personalData.name,
            surname: personalData.surname,
            patronymic: personalData.patronymic,
            city: personalData.city,
            citizenship: personalData.citizenship,
            date_of_birth: personalData.dateOfBirth,
            passport_number: passportData.passportNumber,
            issuer: passportData.issuer,
            date_of_issue: passportData.dateOfIssue,
            subdivision_code: passportData.subdivisionCode,
            education: educationData.education,
            university: educationData.university,
            year_graduation: educationData.yearGraduation,

            source: '',
            contact: '',
            text: '',
        })

        createProfileExperience({ ...experienceData[0] })

        notify({
            delay: 60 * 1000,
            type: "success",
            content: () => (
                <div className="text-green-500">Ураааа</div>
            ),
        });

        setTimeout(() => {
            router.push('/dashboard')
        }, 2000)

        return () => {
            console.log('clean')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createProfile, experienceData])

    return (
        <div className='flex flex-col gap-6'>
            <div>
                {JSON.stringify([personalData, passportData, educationData, experienceData])}
            </div>
        </div>
    )
}

export default memo(SendedStep)
