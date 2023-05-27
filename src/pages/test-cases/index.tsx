import MainLayout from '@/layouts/main'
import { TAnswer, TQuestion, TQuestionRequest, TTestCaseRequest, useGetTestCaseQuery, useSendTestCaseMutation } from '@/services/test-cases/api'
import Back from '@/components/back/back';
import React, { ReactNode, FC, memo, useState, useMemo, useCallback, useEffect } from 'react';
import Spinner from '@/components/spinner/spinner';
import { useSessionStorage } from '@/hooks/use-session-storage';
import { useErrorProcessing } from '@/hooks/use-error-processing';
import { useRouter } from 'next/router';

// Типы данных
export type UserAnswer = {
    question_id: number;
    answer_id: number[];
};


// Компонент вопроса
const QuestionItem: React.FC<{
    question: TQuestion;
    isSelected: boolean;
    number: number;
    isFirst: boolean;
    isLast: boolean;
    isAnswered: boolean;
    onQuestionSelect: (questionId: number) => void;
}> = ({
    question,
    isSelected,
    onQuestionSelect,
    number,
    isFirst,
    isLast,
    isAnswered,
}) => {
        const handleClick = () => {
            onQuestionSelect(question.id);
        };

        return (
            <li
                onClick={handleClick}
                className={`
                    px-3 py-[6px] border-[1px] border-gray-200 border-solid cursor-pointer
                    ${isSelected ? 'bg-purple-50' : 'bg-white'}
                    ${isFirst ? 'rounded-l-lg' : ''}
                    ${isLast ? 'rounded-r-lg' : ''}
                    ${isAnswered ? 'text-purple-600' : ''}
                `}
            >
                {number}
            </li>
        );
    };



// Компонент ответа
const AnswerItem: React.FC<{
    answer: TAnswer;
    isSelected: boolean;
    onAnswerSelect: (answerId: number) => void;
}> = ({ answer, isSelected, onAnswerSelect }) => {
    const handleClick = () => {
        onAnswerSelect(answer.id);
    };

    return (
        <label className='flex items-center gap-2 w-fit'>
            <input
                type='checkbox'
                className='checkbox'
                onChange={handleClick}
                checked={isSelected}
            />
            <span>{answer.text}</span>
        </label>
    );
};

const QuestionNumber: FC<{
    isFirst: boolean,
    isLast: boolean,
    isActive: boolean,
    isAnswered: boolean,
    number: number
}> =
    memo(({
        isFirst,
        isLast,
        isActive,
        isAnswered,
        number,
    }) => {

        return (
            <div
                className={`
                    px-3 py-[6px] bg-white border-[1px] border-gray-200 border-solid
                    ${isFirst ? 'rounded-l-lg' : ''}
                    ${isLast ? 'rounded-r-lg' : ''}
                    ${isActive ? 'bg-purple-50' : ''}
                    ${isAnswered ? 'text-purple-600' : ''}
                `}
            >
                {number}
            </div>
        )
    })
QuestionNumber.displayName = 'QuestionNumber'

// Компонент страницы теста
const TestCases: React.FC = () => {
    const router = useRouter()
    const { data: testCase } = useGetTestCaseQuery(5)
    const [isStarted, setIsStarted] = useSessionStorage('isStarted', false)
    const [sendTestCase, { isSuccess, isError }] = useSendTestCaseMutation()

    useErrorProcessing(isSuccess, 'success', 'Тестирование завершено', () => {
        router.push('/dashboard')
    })
    useErrorProcessing(isError, 'danger')

    const handleSendTestCase = useCallback((userAnswers: UserAnswer[]) => {
        const bool = confirm('Вы уверены, что хотите закончить тестирование?')

        if (!bool) return

        sendTestCase({
            testCaseId: testCase?.id,
            userAnswers
        });
    }, [sendTestCase, testCase?.id])

    useEffect(() => () => {
        sessionStorage.clear()
    }, [])

    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

    useEffect(() => {
        setSelectedQuestionId(testCase?.questions?.[0]?.id)
    }, [testCase?.questions])

    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

    const handleQuestionSelect = (questionId: number) => {
        setSelectedQuestionId(questionId);
    };

    const handleAnswerSelect = useCallback((answerId: number) => {
        if (!selectedQuestionId) return;

        const existingAnswer = userAnswers.find((answer) => answer.question_id === selectedQuestionId);
        if (existingAnswer) {
            const updatedAnswers = existingAnswer.answer_id.includes(answerId)
                ? existingAnswer.answer_id.filter((id) => id !== answerId)
                : [...existingAnswer.answer_id, answerId];
            setUserAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer.question_id === selectedQuestionId ? { ...answer, answer_id: updatedAnswers } : answer
                )
            );
        } else {
            setUserAnswers((prevAnswers) => [...prevAnswers, { question_id: selectedQuestionId, answer_id: [answerId] }]);
        }
    }, [selectedQuestionId, userAnswers]);

    const selectedQuestion = useMemo(() => testCase?.questions?.find((question) => question?.id === selectedQuestionId), [selectedQuestionId, testCase?.questions])

    if (!testCase) return <Spinner />

    return (
        <div>
            <div>
                <div className='custom-container'>
                    <div className='card flex flex-col gap-6'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex justify-between items-center'>
                                <Back />
                                <span
                                    className='text-purple-500 cursor-pointer hover:text-purple-700'
                                    onClick={() => handleSendTestCase(userAnswers)}
                                >
                                    Завершить тестирование
                                </span>
                            </div>
                            <span className=' text-xl font-bold'>{testCase.title}</span>
                        </div>
                        {isStarted
                            ? <>
                                <ul className='flex flex-wrap'>
                                    {testCase.questions.map((question, index, arr) => {
                                        return (
                                            <QuestionItem
                                                key={question.id}
                                                question={question}
                                                isSelected={question.id === selectedQuestionId}
                                                onQuestionSelect={handleQuestionSelect}
                                                number={index + 1}
                                                isFirst={!index}
                                                isLast={arr.length - 1 === index}
                                                isAnswered={userAnswers.some((userAnswer) => userAnswer.question_id === question.id && userAnswer.answer_id.length)}
                                            />
                                        )
                                    })}
                                </ul>
                                <span className=' font-medium'>Вопрос: {selectedQuestion?.text}</span>
                                <ul className='flex flex-col gap-2'>
                                    {selectedQuestion?.answers.map((answer) => (
                                        <AnswerItem
                                            key={answer.id}
                                            answer={answer}
                                            isSelected={userAnswers.some((userAnswer) => userAnswer.question_id === selectedQuestionId && userAnswer.answer_id.includes(answer.id))}
                                            onAnswerSelect={handleAnswerSelect}
                                        />
                                    ))}
                                </ul>
                            </>
                            : <div className='flex flex-col gap-5'>
                                <p>{testCase.description}</p>
                                <button
                                    className='button w-fit'
                                    onClick={() => setIsStarted(true)}
                                >
                                    Начать
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

//@ts-ignore
TestCases.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default TestCases;
