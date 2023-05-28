import { SetValue, useSessionStorage } from "@/hooks/use-session-storage"
import { ChangeEvent, FC, memo } from "react"
import { useForm } from "react-hook-form"
import { ESteps } from "../stepper"

interface IPassportDataStepProps {
    setStep: SetValue<number>
}

export interface IPassportData {
    passportNumber: string
    issuer: string
    dateOfIssue: string
    subdivisionCode: string
}

const PassportDataStep: FC<IPassportDataStepProps> = ({ setStep }) => {
    const [passportData, setPassportData] = useSessionStorage<IPassportData>(ESteps.PASSPORT, {
        passportNumber: '', issuer: '', dateOfIssue: '', subdivisionCode: ''
    })
    const { handleSubmit, register, reset, getValues, formState: { errors } } = useForm<IPassportData>({
        defaultValues: passportData
    });

    return (
        <form onSubmit={handleSubmit(data => {
            setPassportData(data)
            setStep(prev => ++prev)
        })}>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 mb-6">
                    <div className="col-span-3 lg:col-span-2 flex flex-col md:flex-row gap-5">
                        <div className="w-full">
                            <label htmlFor="passportNumber" className="label">Серия и номер паспорта</label>
                            <input
                                id="passportNumber"
                                type="text"
                                {...register('passportNumber', { required: true })}
                                className="input w-full"
                                placeholder="4846 382954"
                                required
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="issuer" className="label">Кем выдан</label>
                            <input
                                id="issuer"
                                type="text"
                                {...register('issuer', { required: true })}
                                className="input w-full"
                                placeholder="ГУ МВД МОСКВЫ"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-6">
                    <div className="col-span-3 lg:col-span-2 flex flex-col md:flex-row gap-5">
                        <div className="w-full">
                            <label htmlFor="dateOfIssue" className="label">Дата выдачи</label>
                            <input
                                id="dateOfIssue"
                                type="date"
                                {...register('dateOfIssue', { required: true })}
                                className="input w-full"
                                required
                                placeholder="10.07.2001"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="subdivisionCode" className="label">Код подразделения</label>
                            <input
                                id="subdivisionCode"
                                type="text"
                                {...register('subdivisionCode', { required: true })}
                                className="input w-full"
                                placeholder="032-324"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
            {Object.keys(errors).length
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

export default memo(PassportDataStep)
