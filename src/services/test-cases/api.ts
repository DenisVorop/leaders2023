import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { BASE_URL, PORTS } from "@/utils/paths";
import { UserAnswer } from "@/pages/test-cases";

export type TAnswer = {
    text: string,
    is_correct: boolean,
    id: number,
}

export type TQuestion = {
    text: string,
    answers: TAnswer[],
    id: number,
    score: number,
}

export type TAnswerRequest = Omit<TAnswer, 'id'>
export type TQuestionRequest = Omit<Omit<TQuestion, 'id'>, 'answers'> & { answers: TAnswerRequest[] }

export type TTestCase = {
    title: string,
    description: string,
    min_score: number,
    questions: TQuestion[],
    id: number
}

export type TTestCaseRequest = Omit<TTestCase, 'id'> & { questions: TQuestionRequest[] }
export interface ISoloTestCase extends Omit<TTestCase, 'questions'> { id: number, questions_count: number }
export interface IOneOfTestCases extends ISoloTestCase { total_score: number }

// const baseQuery = secureQueryBuilder(`${BASE_URL}${PORTS.actions_port}/test-cases/`);
const baseQuery = secureQueryBuilder(`https://mycareer.fun${PORTS.actions_port}/test-cases`);

export const testCasesApi = createApi({
    reducerPath: "testCasesApi",
    baseQuery,
    tagTypes: ["TestCase"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        getAllTestCases: builder.query<IOneOfTestCases[], null>({
            query: () => {
                return {
                    url: `/`,
                    method: "GET",
                }
            },
            providesTags: ["TestCase"],
        }),
        createTestCase: builder.mutation<TTestCase, TTestCaseRequest>({
            query: (body) => {
                return {
                    url: `/`,
                    method: "POST",
                    body,
                }
            },
            invalidatesTags: () => ["TestCase"],
        }),
        getTestCase: builder.query<TTestCase, number>({
            query: (testCaseId) => {
                return {
                    url: `/${testCaseId}`,
                    method: "GET",
                }
            },
        }),
        deleteTestCase: builder.mutation<unknown, number>({
            query: (testCaseId) => {
                return {
                    url: `/${testCaseId}`,
                    method: "DELETE",
                }
            },
            invalidatesTags: () => ["TestCase"],
        }),
        sendTestCase: builder.mutation<unknown, { userAnswers: UserAnswer[], testCaseId: number }>({
            query: ({ testCaseId, userAnswers }) => {
                return {
                    url: `${testCaseId}/response`,
                    method: 'POST',
                    body: userAnswers
                }
            },
        })
    })
})

export const {
    useGetAllTestCasesQuery,
    useCreateTestCaseMutation,
    useGetTestCaseQuery,
    useDeleteTestCaseMutation,
    useSendTestCaseMutation,
} = testCasesApi
