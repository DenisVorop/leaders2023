import { IExperienceData } from "@/features/personal-form/steps/experience-step"
import { TCreateProfileRequest } from "@/services/profile/api"

export type TPagination = {
    start: number
    limit: number
    total: number
}


export type TUserProfile = TCreateProfileRequest
    & IExperienceData
    & { id: number, create_at: string, update_at: string, email: string }
