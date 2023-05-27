import MainLayout from '@/layouts/main'
import { TAnswer, TQuestion, TQuestionRequest, TTestCaseRequest, useGetTestCaseQuery } from '@/services/test-cases/api'
import Back from '@/components/back/back';
import React, { ReactNode, FC, memo, useState } from 'react';

// Типы данных
type Test = {
    id: number;
    text: string;
    score: number;
    questions: {
        id: number;
        text: string;
        answers: {
            id: number;
            text: string;
        }[];
    }[];
};

type UserAnswer = {
    question_id: number;
    answer_id: number[];
}[];

// Компонент вопроса
const QuestionItem: React.FC<{
    question: Test['questions'][number];
    isSelected: boolean;
    number: number;
    isFirst: boolean;
    isLast: boolean;
    onQuestionSelect: (questionId: number) => void;
}> = ({ question, isSelected, onQuestionSelect, number, isFirst, isLast }) => {
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
                `}
        >
            {number}
        </li>
    );
};



// Компонент ответа
const AnswerItem: React.FC<{
    answer: Test['questions'][number]['answers'][number];
    isSelected: boolean;
    onAnswerSelect: (answerId: number) => void;
}> = ({ answer, isSelected, onAnswerSelect }) => {
    const handleClick = () => {
        onAnswerSelect(answer.id);
    };

    return (
        <>
            {/* <li onClick={handleClick} style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                {answer.text}
            </li> */}
            <label className='flex items-center gap-2 w-fit'>
                <input
                    type='checkbox'
                    className='checkbox'
                    onChange={handleClick}
                    checked={isSelected}
                />
                <span>{answer.text}</span>
            </label>
        </>
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
        3
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
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
    const [userAnswers, setUserAnswers] = useState<UserAnswer>([]);

    const test: Test = {
        id: 1,
        text: 'Тестовый тест',
        score: 10,
        questions: [
            {
                id: 1,
                text: 'Вопрос 1',
                answers: [
                    { id: 1, text: 'Ответ 1.1' },
                    { id: 2, text: 'Ответ 1.2' },
                ],
            },
            {
                id: 2,
                text: 'Вопрос 2',
                answers: [
                    { id: 3, text: 'Ответ 2.1' },
                    { id: 4, text: 'Ответ 2.2' },
                ],
            },
        ],
    };

    const handleQuestionSelect = (questionId: number) => {
        setSelectedQuestion(questionId);
    };

    const handleAnswerSelect = (answerId: number) => {
        if (!selectedQuestion) return;

        const existingAnswer = userAnswers.find((answer) => answer.question_id === selectedQuestion);
        if (existingAnswer) {
            const updatedAnswers = existingAnswer.answer_id.includes(answerId)
                ? existingAnswer.answer_id.filter((id) => id !== answerId)
                : [...existingAnswer.answer_id, answerId];
            setUserAnswers((prevAnswers) =>
                prevAnswers.map((answer) =>
                    answer.question_id === selectedQuestion ? { ...answer, answer_id: updatedAnswers } : answer
                )
            );
        } else {
            setUserAnswers((prevAnswers) => [...prevAnswers, { question_id: selectedQuestion, answer_id: [answerId] }]);
        }
    };

    return (
        <div>



            <div>
                <div className='custom-container'>
                    <div className='card flex flex-col gap-6'>
                        <div className='flex flex-col gap-4'>
                            <Back />
                            <div className='flex flex-col gap-2'>
                                <span className=' text-xl font-bold'>{test.text}</span>
                                <p>{'DESCRIPTION'}</p>
                            </div>
                        </div>
                        <ul className='flex flex-wrap'>
                            {test.questions.map((question, index, arr) => (
                                <QuestionItem
                                    key={question.id}
                                    question={question}
                                    isSelected={question.id === selectedQuestion}
                                    onQuestionSelect={handleQuestionSelect}
                                    number={index + 1}
                                    isFirst={!index}
                                    isLast={arr.length - 1 === index}
                                />
                            ))}
                        </ul>
                        <span className=' font-medium'>Вопрос {'number'}. {test.questions.find((question) => question.id === selectedQuestion)?.text}</span>
                        <ul className='flex flex-col gap-2'>
                            {test.questions
                                .find((question) => question.id === selectedQuestion)
                                ?.answers.map((answer) => (
                                    <AnswerItem
                                        key={answer.id}
                                        answer={answer}
                                        isSelected={userAnswers.some(
                                            (userAnswer) =>
                                                userAnswer.question_id === selectedQuestion && userAnswer.answer_id.includes(answer.id)
                                        )}
                                        onAnswerSelect={handleAnswerSelect}
                                    />
                                ))}
                        </ul>
                    </div>
                </div>
            </div>


            <h2>Выбранные ответы</h2>
            <ul>
                {userAnswers.map((answer, index) => (
                    <li key={index}>
                        Вопрос {answer.question_id}: Ответы [{answer.answer_id.join(', ')}]
                    </li>
                ))}
            </ul>
        </div>
    );
};

//@ts-ignore
TestCases.getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>

export default TestCases;
