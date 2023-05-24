import MainLayout from '@/layouts/main'
import { FC, ReactNode } from 'react'

interface ITestCasesProps { }

const TestCases: FC<ITestCasesProps> = () => {
    return (
        <div>
            <div className='custom-container'>
                <div className='card'>таблица тест кейсов</div>
            </div>
        </div>
    )
}

// @ts-ignore
TestCases.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default TestCases
