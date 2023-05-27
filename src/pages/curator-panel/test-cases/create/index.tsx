import { useErrorProcessing } from '@/hooks/use-error-processing'
import MainLayout from '@/layouts/main'
import { TAnswerRequest, TQuestionRequest, TTestCaseRequest, useCreateTestCaseMutation } from '@/services/test-cases/api'
import { Dispatch, FC, ReactNode, SetStateAction, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Back from '@/components/back/back'
import { useNotify } from '@/services/notification/zustand'
import { useRouter } from 'next/router'
import CuratorHeader from '@/features/header/curator-header'

const initialCaseTestInfo = {
    title: 'Тестирование для кандидатов',
    description: 'Мы приглашаем вас принять участие в опросе, который поможет нам оценить ваш опыт использования нашей платформы. Ваше мнение важно для нас, чтобы улучшить наш сервис и предложить вам ещё более удобные и полезные функции.',
    min_score: 20
}
type TInitialTestCase = typeof initialCaseTestInfo
export type TInitialQuestion = Omit<TQuestionRequest, 'answers'>

const inititalTestCase: TTestCaseRequest = { ...initialCaseTestInfo, questions: [] }

interface ICreateTestCasesProps { }

const CreateTestCases: FC<ICreateTestCasesProps> = () => {
    const router = useRouter()
    const [testCase, setTestCase] = useState(inititalTestCase)
    const [createTestCase, { isSuccess, isError }] = useCreateTestCaseMutation()
    const { register, handleSubmit, getValues } = useForm<TInitialTestCase>({ defaultValues: initialCaseTestInfo })

    useEffect(() => () => {
        sessionStorage.clear()
    }, [])

    useErrorProcessing(isSuccess, 'success', 'Тест-кейс успешно создан!', () => {
        setTestCase(inititalTestCase)
        router.push('/curator-panel/test-cases')
    })
    useErrorProcessing(isError, 'danger')

    const minScore = useMemo(() => {
        const percent = +getValues().min_score / 100
        const fullScore = testCase.questions.reduce((acc, cur) => {
            return acc + +cur.score
        }, 0)
        return fullScore * percent
    }, [getValues, testCase])

    return (
        <div>
            <div className='custom-container'>
                <div className='card flex flex-col gap-6'>
                    <div className='flex flex-col gap-4'>
                        <div className='flex justify-between'>
                            <Back link="/curator-panel/test-cases" label="К тест кейсам" />
                            <button
                                onClick={handleSubmit((data) => createTestCase({ ...testCase, ...data, min_score: minScore }))}
                                className='button'
                            >
                                Cохранить тест кейс
                            </button>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-3'>
                                <input
                                    className='input text-xl font-bold text-gray-900 bg-white'
                                    {...register('title', { required: true })}
                                />
                                <textarea
                                    className='textarea text-base text-gray-900 h-[96px] bg-white'
                                    {...register('description', { required: true })}
                                />
                            </div>
                            <div>

                                <span>Минимальный процент выполнения теста (%):</span>
                                <input
                                    className='w-[40px] ml-2'
                                    {...register('min_score', { required: true })}
                                    type='number'
                                    required
                                    min={0}
                                    max={100}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='card bg-white border-dashed border-2'>
                        <CreateQuestion setTestCase={setTestCase} />
                    </div>
                    <div className='flex flex-col gap-5'>
                        {testCase.questions.map((question, index) => {
                            return (
                                <div key={question.text} className='card flex flex-col gap-6'>
                                    <span>{question.text}  <span className='ml-1 text-sm text-gray-400'>{question.score} баллов</span></span>
                                    <div className='flex flex-col gap-3'>
                                        {question.answers.map((answer, index) => {
                                            return (
                                                <div key={index} className='flex items-center gap-3 w-fit cursor-pointer'>
                                                    <input
                                                        type='checkbox'
                                                        checked={answer.is_correct}
                                                        className='checkbox'
                                                    />
                                                    <input
                                                        className='input w-[274px]'
                                                        value={answer.text}
                                                    />
                                                </div>
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


const initialQuestion: TInitialQuestion = { text: 'Сколько будет 2*2+2?', score: 5 }

const CreateQuestion: FC<{ setTestCase: Dispatch<SetStateAction<TTestCaseRequest>> }> = memo(({ setTestCase }) => {
    const [answers, setAnswers] = useState<TAnswerRequest[]>([])
    const { register, handleSubmit, reset } = useForm<TInitialQuestion>({ defaultValues: initialQuestion })
    const [notify] = useNotify()

    const handleCreateAnswer = useCallback((data: TInitialQuestion) => {
        if (answers.length < 2) {
            notify({ type: 'danger', content: () => 'Необходимо добавить как минимум 2 варианта ответа' })
            return
        }
        if (!answers.find(answer => answer.is_correct)) {
            notify({ type: 'danger', content: () => 'Должен быть как минимум 1 правильный ответ' })
            return
        }
        setTestCase(prev => {
            const questions = prev.questions
            questions.unshift({ ...data, answers })
            return { ...prev, questions }
        })
        notify({ type: 'success', content: () => 'Вариант ответа успешно добавлен!' })
        reset()
        setAnswers([])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, setTestCase, reset])

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
                <input
                    {...register('text', { required: true })}
                    className='input text-base font-bold'
                    required
                />
                <div className='flex gap-4 items-baseline'>
                    <span className=' text-sm'>Вес вопроса</span>
                    <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((i, index) =>
                            <div
                                key={index}
                                className={`${!index ? 'badge-purple' : 'badge'} hover:cursor-pointer`}
                            >
                                {i}
                            </div>
                        )
                        }
                    </div>
                    <input
                        {...register('score', { required: true })}
                        className='input w-[48px] py-1'
                        required
                    />
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {answers.map((answer, index) => {
                    return <div key={index} className='flex items-center gap-3 w-fit cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={answer.is_correct}
                            className='checkbox'
                            onChange={() => {
                                setAnswers((prev) => {
                                    return prev.map((mapAnswer) => {
                                        if (mapAnswer.text === answer.text) {
                                            return {
                                                ...mapAnswer,
                                                is_correct: !mapAnswer.is_correct
                                            };
                                        }
                                        return mapAnswer;
                                    });
                                });
                            }}
                        />
                        <input
                            className='input w-[274px]'
                            value={answer.text}
                        />
                    </div>
                })}
            </div>
            <CreateAnswer setAnswers={setAnswers} />
            <button onClick={handleSubmit(handleCreateAnswer)} className='button'>
                Добавить вопрос
            </button>
        </div>
    )
})
CreateQuestion.displayName = 'CreateQuestion'


const initialAnswer: TAnswerRequest = { text: '', is_correct: false }

const CreateAnswer: FC<{ setAnswers: Dispatch<SetStateAction<TAnswerRequest[]>> }> = ({ setAnswers }) => {
    const { register, handleSubmit, reset } = useForm({ defaultValues: initialAnswer })

    const handleCreateAnswer = useCallback((data: TAnswerRequest) => {
        setAnswers(prev => ([...prev, data]))
        reset()
    }, [reset, setAnswers])

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-3 w-fit cursor-pointer'>
                <input
                    {...register('is_correct')}
                    className='input w-fit'
                    type='checkbox'
                    required
                />
                <input
                    className='input w-[274px]'
                    placeholder='Ответ...'
                    {...register('text', { required: true })}
                    required
                />
            </div>
            <span onClick={handleSubmit(handleCreateAnswer)} className='text-purple-600 inline-flex items-center gap-1 cursor-pointer'>
                <svg className='w-4 h-4' fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Добавить вариант ответа
            </span>
        </div>
    )
}

// @ts-ignore
CreateTestCases.getLayout = (page: ReactNode) => <MainLayout header={<CuratorHeader />}>{page}</MainLayout>

export default CreateTestCases
