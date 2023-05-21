import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { PORTS } from "@/utils/paths";

// import { IExperienceData } from './experience-step'
import { IPersonalData } from "@/features/personal-form/steps/personal-data-step";
import { IPassportData } from "@/features/personal-form/steps/passport-data-step";
import { IEducationData } from "@/features/personal-form/steps/education-step";
import { IExperienceData } from "@/features/personal-form/steps/experience-step";
import { TUserProfile } from "@/types/types";

export type TCreateProfileRequest = (Omit<IPersonalData, 'dateOfBirth'> & { date_of_birth: string })
    & (Omit<IPassportData, 'dateOfIssue' | 'subdivisionCode' | 'passportNumber'>
        & { date_of_issue: string, subdivision_code: string, passport_number: string })
    & (Omit<IEducationData, 'yearGraduation'> & { year_graduation: string })
    & { source?: string, contact?: string, text?: string }

const baseQuery = secureQueryBuilder(`${PORTS.profile_port}/profile/`);

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery,
    tagTypes: ["Profile"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        createProfile: builder.mutation<any, TCreateProfileRequest>({
            query: (body) => {
                return {
                    url: `/`,
                    method: "POST",
                    body,
                }
            },
            // invalidatesTags: () => ["Profile"],
            transformResponse: (response) => response
        }),
        createProfileExperience: builder.mutation<any, IExperienceData>({
            query: (body) => {
                return {
                    url: `/experience`,
                    method: "POST",
                    body,
                }
            },
            // invalidatesTags: () => ["Profile"],
            transformResponse: (response) => response
        }),
        getProfile: builder.query<TUserProfile, null>({
            query: () => {
                return {
                    url: `/user`,
                    method: "GET",
                }
            },
            providesTags: ["Profile"],
            transformResponse: (response: TUserProfile) => response
        }),
        getExperience: builder.query<(IExperienceData & { experience_id: number })[], null>({
            query: () => {
                return {
                    url: `/user/experience`,
                    method: "GET",
                }
            },
            providesTags: ["Profile"],
            transformResponse: (response: (IExperienceData & { experience_id: number })[]) => response
        }),
    })
})

export const {
    // USER
    useCreateProfileMutation,
    useCreateProfileExperienceMutation,
    useGetProfileQuery,
    useGetExperienceQuery,
} = profileApi
