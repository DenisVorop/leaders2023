import { IExperienceData } from "@/features/personal-form/steps/experience-step"
import { TCreateProfileRequest } from "@/services/profile/api"
import { EProfileStatuses } from "./enums"

export type TPagination = {
    start: number
    limit: number
    total: number
}


export type TUserProfile = TCreateProfileRequest
    & IExperienceData
    & { id: number, create_at: string, update_at: string, email: string, status: EProfileStatuses }

export type TExperience = (IExperienceData & { experience_id: number })

export type TMetaPagination = { total: number, page: number, size: number, pages: number }
export interface IAllProfiles extends TMetaPagination { items: TUserProfile[] }
export interface IAllExperiences extends TMetaPagination { items: (TExperience & { email: string })[] }
