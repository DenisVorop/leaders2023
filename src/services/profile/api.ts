import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { BASE_URL, PORTS } from "@/utils/paths";

// import { IExperienceData } from './experience-step'
import { IPersonalData } from "@/features/personal-form/steps/personal-data-step";
import { IPassportData } from "@/features/personal-form/steps/passport-data-step";
import { IEducationData } from "@/features/personal-form/steps/education-step";
import { IExperienceData } from "@/features/personal-form/steps/experience-step";
import { IAllExperiences, IAllProfiles, TExperience, TUserProfile } from "@/types/types";

export type TCreateProfileRequest = (Omit<IPersonalData, 'dateOfBirth'> & { date_of_birth: string })
    & (Omit<IPassportData, 'dateOfIssue' | 'subdivisionCode' | 'passportNumber'>
        & { date_of_issue: string, subdivision_code: string, passport_number: string })
    & (Omit<IEducationData, 'yearGraduation'> & { year_graduation: string })
    & { source?: string, contact?: string, text?: string, direction?: string }

const baseQuery = secureQueryBuilder(`${BASE_URL}${PORTS.profile_port}/profile/`);

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
        // USER
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
        getExperience: builder.query<TExperience[], null>({
            query: () => {
                return {
                    url: `/user/experience`,
                    method: "GET",
                }
            },
            providesTags: ["Profile"],
            transformResponse: (response: TExperience[]) => response
        }),


        // CURATOR
        getAllProfiles: builder.query<IAllProfiles, null>({
            query: () => {
                return {
                    url: `/`,
                    method: "GET",
                }
            },
            providesTags: ["Profile"],
            transformResponse: (response: IAllProfiles) => response
        }),
        getAllExperiences: builder.query<IAllExperiences, null>({
            query: () => {
                return {
                    url: `/experience`,
                    method: "GET",
                }
            },
            providesTags: ["Profile"],
            transformResponse: (response: IAllExperiences) => response
        }),
    })
})

export const {
    // USER
    useCreateProfileMutation,
    useCreateProfileExperienceMutation,
    useGetProfileQuery,
    useGetExperienceQuery,


    // CURATOR
    useGetAllProfilesQuery,
    useGetAllExperiencesQuery,
} = profileApi
