import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { BASE_URL, PORTS } from "@/utils/paths";

export type TAnswer = {
    text: string,
    is_correct: boolean,
    test_cases_question_id: number,
}

export type TQuestion = {
    text: string,
    answers: TAnswer[],
    test_case_id: number,
    score: number,
}

export type TAnswerRequest = Omit<TAnswer, 'test_cases_question_id'>
export type TQuestionRequest = Omit<Omit<TQuestion, 'test_case_id'>, 'answers'> & { answers: TAnswerRequest[] }

export type TTestCase = {
    title: string,
    description: string,
    min_score: number,
    questions: TQuestion[],
}

export type TTestCaseRequest = TTestCase & { questions: TQuestionRequest[] }

const baseQuery = secureQueryBuilder(`${BASE_URL}${PORTS.actions_port}/test-cases/`);

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
    })
})

export const {
    useCreateTestCaseMutation,
} = testCasesApi
