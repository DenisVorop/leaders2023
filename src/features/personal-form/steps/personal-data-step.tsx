import { SetValue, useSessionStorage } from "@/hooks/use-session-storage"
import { FC, memo, useState } from "react"
import { useForm } from "react-hook-form"
import { ESteps } from "../stepper"

interface IPersonalDataStepProps {
    setStep: SetValue<number>
}


export interface IPersonalData {
    name: string
    surname: string
    patronymic?: string
    dateOfBirth: string
    city: string
    citizenship: string
    gender: 'male' | 'female'
}

const PersonalDataStep: FC<IPersonalDataStepProps> = ({ setStep }) => {
    const [personalData, setPersonalData] = useSessionStorage<Omit<IPersonalData, 'gender'>>(ESteps.PERSONAL, {
        name: '', surname: '', patronymic: '', dateOfBirth: '', city: '', citizenship: ''
    })
    const [gender, setGender] = useState<'male' | 'female'>('male')
    const { handleSubmit, register, reset, getValues, formState: { errors } } = useForm<IPersonalData>({
        defaultValues: personalData
    });

    return (

        <form onSubmit={handleSubmit(data => {
            console.log(Object.assign(data, { gender }))
            setPersonalData(Object.assign(data, gender))
            setStep(prev => ++prev)
        })}>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 mb-6">
                    <div className=" col-span-2 flex gap-5">
                        <div className="w-full">
                            <label htmlFor="name" className="label">Имя</label>
                            <input
                                id="name"
                                type="text"
                                {...register('name', { required: true })}
                                className="input"
                                placeholder="Денис"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="surname" className="label">Фамилия</label>
                            <input
                                id="surname"
                                type="text"
                                {...register('surname', { required: true })}
                                className="input"
                                placeholder="Воропаев"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="patronymic" className="label">Отчество</label>
                            <input
                                id="patronymic"
                                type="text"
                                {...register('patronymic', { required: false })}
                                className="input"
                                placeholder="Юрьевич"
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-6">
                    <div className=" col-span-2 flex gap-5">
                        <div className="w-full">
                            <label htmlFor="dateOfBirth" className="label">Дата рождения</label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                {...register('dateOfBirth', { required: true })}
                                className="input"
                                required
                                placeholder="10.07.2001"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="city" className="label">Город проживания</label>
                            <input
                                id="city"
                                type="text"
                                {...register('city', { required: true })}
                                className="input"
                                placeholder="Москва"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="citizenship" className="label">Гражданство</label>
                            <input
                                id="citizenship"
                                type="text"
                                {...register('citizenship', { required: true })}
                                className="input"
                                placeholder=""
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-6">
                    <div className=" col-span-2 flex gap-5">
                        <div>
                            <div className="label">Пол</div>
                            <fieldset className="w-full flex items-center gap-4">
                                <label htmlFor="genderMale" className="flex items-center gap-3">
                                    <input
                                        id="genderMale"
                                        type="radio"
                                        checked={gender === 'male'}
                                        onChange={() => setGender('male')}
                                        className="text-purple-600"
                                        required
                                    />
                                    <span>Мужской</span>
                                </label>
                                <label htmlFor="genderFemale" className="flex items-center gap-3">
                                    <input
                                        id="genderFemale"
                                        type="radio"
                                        checked={gender === 'female'}
                                        onChange={() => setGender('female')}
                                        className="text-purple-600"
                                        required
                                    />
                                    <span>Женский</span>
                                </label>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            {Object.keys(errors).length
                ? <div className="flex items-center gap-1">{Object.values(errors).map(error => <span key={error.type}>{error.message}</span>)}</div>
                : null
            }
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="button"
                >
                    Дальше
                </button>
            </div>
        </form>

    )
}

export default memo(PersonalDataStep)
