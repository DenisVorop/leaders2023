import { FC, memo, useEffect, useLayoutEffect } from 'react'
import { IPersonalData } from './personal-data-step'
import { IPassportData } from './passport-data-step'
import { IEducationData } from './education-step'
import { IExperienceData } from './experience-step'
import { useCreateProfileExperienceMutation, useCreateProfileMutation } from '@/services/profile/api'
import { useRouter } from 'next/router'
import { useNotify } from '@/services/notification/zustand'
import { useErrorProcessing } from '@/hooks/use-error-processing'

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

    const [createProfile, { isSuccess: isSuccessProfile, isError: isErrorProfile }] = useCreateProfileMutation()
    const [createProfileExperience, { isSuccess: isSuccessExperience, isError: isErrorExperience }] = useCreateProfileExperienceMutation()

    useLayoutEffect(() => {
        if (
            !personalData || !passportData ||
            !educationData || !experienceData
        ) return

        createProfile({
            name: personalData.name,
            surname: personalData.surname,
            patronymic: personalData.patronymic,
            gender: personalData.gender,
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

            direction: 'Не заполнено',
            source: '',
            contact: '',
            text: '',
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createProfile, experienceData])

    useErrorProcessing(isSuccessExperience, 'success', 'Вы успешно заполнили анкету', () => {
        setTimeout(() => {
            router.push('/dashboard')
        }, 2000)
    })
    useErrorProcessing(isErrorExperience, 'danger', 'Произошла ошибка при заполнении анкеты')
    useErrorProcessing(isSuccessProfile, 'success', 'Вы успешно создали профиль', () => createProfileExperience({ ...experienceData[0] }))
    useErrorProcessing(isErrorProfile, 'danger', 'Произошла ошибка при создании профиля')

    return (
        <div className='flex flex-col gap-6'>
            <div>
                {JSON.stringify([personalData, passportData, educationData, experienceData])}
            </div>
        </div>
    )
}

export default memo(SendedStep)
