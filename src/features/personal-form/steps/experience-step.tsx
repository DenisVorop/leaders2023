import { SetValue, useSessionStorage } from "@/hooks/use-session-storage"
import { FC, memo } from "react"
import { useForm } from "react-hook-form"
import { ESteps } from "../stepper"

interface IExperienceStepProps {
    setStep: SetValue<number>
}

export interface IExperienceData {
    duration: string
    place: string
    position: string
    description: string
}

const ExperienceStep: FC<IExperienceStepProps> = ({ setStep }) => {
    const [experienceData, setExperienceData] = useSessionStorage<IExperienceData[]>(ESteps.EXPERIENCE, [])
    const { handleSubmit, register } = useForm<IExperienceData>({
        defaultValues: experienceData[0]
    });

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(data => {
                setExperienceData([data])
                setStep(prev => ++prev)
            })}
        >

            <div className="flex flex-col">
                <div className="grid grid-cols-3 mb-6">
                    <div className="grid grid-cols-3 col-span-2 gap-5">
                        <div>
                            <label htmlFor="duration" className="label">Продолжительность</label>
                            <input
                                id="duration"
                                type="text"
                                {...register('duration', { required: true })}
                                className="input"
                                placeholder=""
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="place" className="label">Место работы</label>
                            <input
                                id="place"
                                type="text"
                                {...register('place', { required: true })}
                                className="input"
                                placeholder=""
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="position" className="label">Должность</label>
                            <input
                                id="position"
                                type="text"
                                {...register('position', { required: true })}
                                className="input"
                                required
                                placeholder=""
                            />
                        </div>
                    </div>
                </div>

                <label htmlFor="description" className="label">Опишите свой опыт работы</label>
                <textarea
                    id="description"
                    rows={4}
                    className="textarea"
                    placeholder=""
                    {...register('description', { required: true })}
                />
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 cursor-not-allowed w-fit">
                <div className="w-5 h-5">
                    <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                </div>
                Добавить место работы
            </div>

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

export default memo(ExperienceStep)
