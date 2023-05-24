import { ESortParams, ESortDirections, INews, TNewsData, TContentRequest, useGetNewsQuery } from "../content/api"

export const initialContentParams = {
    offset: 0,
    limit: 20,
    searchQuery: '',
    param: ESortParams.CREATED_AT,
    sortDirection: ESortDirections.DESC,
}

const SEC_60 = 60 * 1000

interface IParams { interval?: number, newsParams?: TContentRequest }
export const useNews = (params: IParams): [TNewsData, boolean] => {
    const { data: newsData, isLoading } = useGetNewsQuery(params?.newsParams ?? initialContentParams, {
        pollingInterval: params?.interval || SEC_60
    })

    return [newsData, isLoading]
}

export function isTNewsData(obj: TNewsData): obj is TNewsData {
    if (!obj || !obj.news || !Array.isArray(obj.news)) {
        return false
    }

    if (!obj.news.every((item: INews) => {
        return typeof item.id === 'number' &&
            typeof item.name === 'string' &&
            typeof item.author === 'string' &&
            typeof item.short_text === 'string' &&
            typeof item.full_text === 'string' &&
            typeof item.createdAt === 'string' &&
            typeof item.updatedAt === 'string' &&
            typeof item.publishedAt === 'string' &&
            typeof item.tag === 'string' &&
            (typeof item.img === 'string' || Array.isArray(item.img))
    })) {
        return false
    }

    if (typeof obj.total !== 'number') {
        return false
    }

    return true
}
