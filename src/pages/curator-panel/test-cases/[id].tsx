import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs'
import Spinner from '@/components/spinner/spinner'
import CuratorHeader from '@/features/header/curator-header'
import MainLayout from '@/layouts/main'
import { wrapper, TStore } from '@/services/store'
import { useGetTestCaseQuery } from '@/services/test-cases/api'
import { TBreadcrumbs } from '@/types/types'
import { GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { FC, ReactNode } from 'react'

interface ITestCaseProps {
    testCaseId: number
    paths: TBreadcrumbs
}

const TestCase: FC<ITestCaseProps> = ({ testCaseId, paths }) => {
    const router = useRouter()
    const { data: testCase, isLoading, isError } = useGetTestCaseQuery(testCaseId)

    useEffect(() => {
        if (isError) {
            router.back()
        }
    }, [isError, router])

    const minPercent = useMemo(() => {
        if (!testCase) return 101
        const percent = testCase.min_score * 100
        const fullScore = testCase.questions.reduce((acc, cur) => {
            return acc + +cur.score
        }, 0)
        return percent / fullScore
    }, [testCase])

    if (isLoading) return <Spinner />

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-4'>
                    <div className='flex flex-col gap-4'>
                        <Breadcrumbs paths={paths} />
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-3'>
                                <span className='text-xl font-bold text-gray-900 bg-white rounded-lg px-2 py-1'>
                                    {testCase?.title}
                                </span>
                                <span className='text-base text-gray-900 h-[96px] bg-white rounded-lg px-2 py-1'>
                                    {testCase?.description}
                                </span>
                            </div>
                            <div>
                                <span>Минимальный процент выполнения теста: {minPercent}%</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5'>
                        {testCase?.questions?.map((question, index) => {
                            return (
                                <div key={question?.text} className='card flex flex-col gap-6'>
                                    <span>{question?.text}  <span className='ml-1 text-sm text-gray-400'>{question?.score} баллов</span></span>
                                    <div className='flex flex-col gap-3'>
                                        {question?.answers?.map((answer, index) => {
                                            return (
                                                <label htmlFor={`checkbox-${index}`} key={index} className='flex items-center gap-3 w-fit cursor-pointer'>
                                                    <input
                                                        type='checkbox'
                                                        id={`checkbox-${index}`}
                                                        checked={answer?.is_correct}
                                                        onChange={() => { }}
                                                        className='checkbox'
                                                    />
                                                    {answer?.text}
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
TestCase.getLayout = (page: ReactNode) => <MainLayout header={<CuratorHeader />}>{page}</MainLayout>

export const getStaticProps = wrapper.getStaticProps(
    (store: TStore) => async (ctx: GetStaticPropsContext) => {
        const testCaseId = ctx.params.id

        const paths = [
            { title: `Все тест-кейсы`, url: '/curator-panel/test-cases' },
            { title: `Тест-кейс #${testCaseId}` },
        ]

        return {
            props: {
                testCaseId: +testCaseId,
                paths,
            }
        }
    }
)


export const getStaticPaths = async () => ({ paths: [], fallback: "blocking" })


export default TestCase
