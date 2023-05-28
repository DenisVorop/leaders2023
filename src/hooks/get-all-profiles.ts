import { useGetAllExperiencesQuery, useGetAllProfilesQuery } from "@/services/profile/api"
import { IAllProfiles, TExperience, TUserProfile } from "@/types/types";
import { useMemo } from "react"

// todo слишком жирный обход, надо оптимизировать запросы
// todo будет исправляться - опыт в профилях

export type TFullProfile = {
    experience: TExperience[]
    profile: TUserProfile
}

/**
 * Для куратора на получение всех анкет (анкета + профиль)
 */
export const useGetAllProfiles = (): [TFullProfile[], Record<string, TUserProfile>] => {
    const { data: allProfiles } = useGetAllProfilesQuery(null)
    const { data: allExperiences } = useGetAllExperiencesQuery(null)

    const profiles2Obj = useMemo(() => {
        return allProfiles?.items?.reduce((acc, cur) => {
            return { ...acc, [cur.email]: cur }
        }, {})
    }, [allProfiles])

    const fullProfiles = useMemo(() => {
        if (!profiles2Obj || !allExperiences) {
            return []
        }

        const result = [] as TFullProfile[]

        for (let i = 0; i < allExperiences?.items?.length; i++) {
            const exp = allExperiences?.items?.[i]
            const profile: TUserProfile = profiles2Obj?.[exp.email]
            const pushedProfile = result.find(item => item?.profile?.id === profile?.id)

            if (pushedProfile) {
                pushedProfile?.experience?.push(exp)
            } else {
                result.push({ profile, experience: [exp] })
            }
        }
        return result
    }, [profiles2Obj, allExperiences])

    return [fullProfiles, profiles2Obj]
}
