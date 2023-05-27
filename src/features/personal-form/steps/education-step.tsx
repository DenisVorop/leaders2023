import { SetValue, useSessionStorage } from "@/hooks/use-session-storage"
import { FC, memo } from "react"
import { useForm } from "react-hook-form"
import { ESteps } from "../stepper"


interface IEducationStepProps {
    setStep: SetValue<number>
}

export interface IEducationData {
    education: string
    university: string
    yearGraduation: string
}

const EducationStep: FC<IEducationStepProps> = ({ setStep }) => {
    const [educationData, setEducationData] = useSessionStorage<IEducationData>(ESteps.EDUCATION, {
        education: '', university: '', yearGraduation: ''
    })
    const { handleSubmit, register, reset, getValues, formState: { errors } } = useForm<IEducationData>({
        defaultValues: educationData
    });


    return (
        <form onSubmit={handleSubmit(data => {
            setEducationData(data)
            setStep(prev => ++prev)
        })}>

            <div className="grid grid-cols-3 mb-6">
                <div className=" grid grid-cols-3 col-span-2 gap-5">
                    <div>
                        <label htmlFor="education" className="label">Уровень образования</label>
                        <input
                            id="education"
                            type="text"
                            {...register('education', { required: true })}
                            className="input"
                            placeholder="Бакалавриат"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="university" className="label">Университет</label>
                        <input
                            id="university"
                            type="text"
                            {...register('university', { required: true })}
                            className="input"
                            placeholder="МГТУ СТАНКИН"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="yearGraduation" className="label">Год окончания университета</label>
                        <input
                            id="yearGraduation"
                            type="month"
                            {...register('yearGraduation', { required: true })}
                            className="input"
                            required
                            placeholder="10.07.2001"
                        />
                    </div>
                </div>
            </div>
            {Object.keys(errors)?.length
                ? <div className="flex items-center gap-1">{Object.values(errors).map(error => <span key={error.type}>{error.message}</span>)}</div>
                : null
            }
            <div className="flex justify-between">
                <button
                    type="button"
                    className="px-5 py-2 hover:text-purple-500"
                    onClick={() => setStep(prev => --prev)}
                >
                    Назад
                </button>
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

export default memo(EducationStep)
