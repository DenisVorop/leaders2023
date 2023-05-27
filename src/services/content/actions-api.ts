import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { PORTS } from "@/utils/paths";

export type TSendResponseRequest = { formData: FormData, text: string, projectId: number, contact: string, fileName: string }
export type TRespondedProject = {
    id: number
    project_id: number
    name: string
    contact: string
    text: string
    create_at: string
    update_at: string
    status: string
    comment: string
    status_user: string
    file: string
}

const baseQuery = secureQueryBuilder(`https://mycareer.fun${PORTS.actions_port}`);

export const contentActionsApi = createApi({
    reducerPath: "contentActionsApi",
    baseQuery,
    tagTypes: ["Projects"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        sendResponseProject: builder.mutation<unknown, TSendResponseRequest>({
            query: ({ formData, projectId, contact, text, fileName }) => {
                const params = new URLSearchParams()
                params.set('project_id', '' + projectId)
                params.set('text', text)
                params.set('contact', contact)
                params.set('name_file', fileName)
                return {
                    url: `/project/?${params}`,
                    method: 'POST',
                    body: formData
                }
            },
            invalidatesTags: () => ['Projects']
        }),
        getRespondedProjects: builder.query<[number[], TRespondedProject[]], null>({
            query: () => {
                return {
                    url: `/project/user`,
                    method: 'GET'
                }
            },
            transformResponse: (response: TRespondedProject[]) => {
                const idsProjects = response?.map(response => response.project_id)
                return [idsProjects, response]
            },
            providesTags: ['Projects']
        })
    })
})

export const {
    useSendResponseProjectMutation,
    useGetRespondedProjectsQuery,
} = contentActionsApi
