import Stepper from '@/features/personal-form/stepper'
import MainLayout from '@/layouts/main'
import { FC, useEffect } from 'react'

interface IPersonalFormProps { }

const PersonalForm: FC<IPersonalFormProps> = () => {
    useEffect(() => {
        return () => {
            sessionStorage.clear()
        }
    }, [])

    return (
        <div className="custom-container w-full">
            <Stepper />
        </div>
    )
}

PersonalForm.getLayout = page => <MainLayout>{page}</MainLayout>

export default PersonalForm
