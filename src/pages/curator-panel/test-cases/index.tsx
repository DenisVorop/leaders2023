import Spinner from '@/components/spinner/spinner'
import { useErrorProcessing } from '@/hooks/use-error-processing'
import useHover from '@/hooks/use-hover'
import MainLayout from '@/layouts/main'
import { IOneOfTestCases, useDeleteTestCaseMutation, useGetAllTestCasesQuery } from '@/services/test-cases/api'
import { toTestCase } from '@/utils/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, ReactNode, memo, useCallback, useRef, MouseEvent } from 'react'

interface ITestCasesProps { }

const TestCases: FC<ITestCasesProps> = () => {
    const router = useRouter()
    const { data, isLoading } = useGetAllTestCasesQuery(null, { pollingInterval: 60 * 1000 })
    const [deleteTestCase, { isSuccess: isSuccessDeleted, isError: isErrorDeleted }] = useDeleteTestCaseMutation()

    const handleDeleteTestCase = useCallback((testCaseId: number) =>
        () => {
            const bool = confirm(`Вы уверены, что хотите удалить тест-кейс #${testCaseId}?`)
            if (!bool) return

            deleteTestCase(testCaseId)
        }, [deleteTestCase])

    useErrorProcessing(isSuccessDeleted, 'success', 'Тест-кейс успешно удален')
    useErrorProcessing(isErrorDeleted, 'danger')

    if (isLoading) return <Spinner />

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-6'>
                    <div className='flex justify-between'>
                        <span className='text-xl font-bold'>Тестирования</span>
                        <button className='button' onClick={() => router.push('/curator-panel/test-cases/create')}>
                            + Добавить тест
                        </button>
                    </div>
                    {data?.length
                        ? <div className='grid grid-cols-2 gap-5'>
                            {data.map(testCase => {
                                return (
                                    <TestCase
                                        testCase={testCase}
                                        key={testCase.id}
                                        handleDeleteTestCase={handleDeleteTestCase(testCase.id)}
                                    />
                                )
                            })}
                        </div>
                        : <div>Пустовато</div>
                    }
                </div>
            </div>
        </div>
    )
}


interface ITestCaseProps { testCase: IOneOfTestCases, handleDeleteTestCase: () => void }
const TestCase: FC<ITestCaseProps> = memo(({
    testCase,
    handleDeleteTestCase,
}) => {
    const ref = useRef<HTMLDivElement>()
    const isHovering = useHover(ref)

    return (
        <Link href={toTestCase(testCase.id)}>
            <div className='card bg-white flex flex-col gap-5 cursor-pointer' ref={ref}>
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between h-6'>
                        <span className='badge-purple flex items-center'>Порог прохождения {testCase.min_score * 100 / testCase.total_score}%</span>
                        {isHovering &&
                            <svg
                                onClick={(e: MouseEvent<SVGElement>) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    handleDeleteTestCase()
                                }}
                                className='w-6 h-6 hover:text-purple-600 relative z-10'
                                fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        }
                    </div>
                    <span className='font-bold text-xl text-purple-600'>{testCase.title}</span>
                    <span className=' text-gray-400 text-xs'>
                        Всего вопросов: {testCase.questions_count}
                    </span>
                </div>
                <div className='h-[50px] overflow-hidden'>
                    {testCase.description}
                </div>
            </div>
        </Link>
    )
})

TestCase.displayName = 'TestCase'

// @ts-ignore
TestCases.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default TestCases
