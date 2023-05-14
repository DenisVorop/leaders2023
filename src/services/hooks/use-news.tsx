import { EParams, ESortDirections, INews, TNewsData, TNewsRequest, useGetNewsQuery } from "../content/api"
import { useNotify } from "../notification/zustand"

export const initialNewsParams = {
    offset: 0,
    limit: 20,
    searchQuery: '',
    param: EParams.CREATED_AT,
    sortDirection: ESortDirections.DESC,
}

const SEC_60 = 60 * 1000

interface IParams { interval?: number, newsParams?: TNewsRequest }
export const useNews = (params: IParams) => {
    const [notify] = useNotify();

    const { data: newsData } = useGetNewsQuery(params?.newsParams ?? initialNewsParams, {
        pollingInterval: params?.interval || SEC_60
    })

    if (isTNewsData(newsData)) {
        return [newsData]
    } else {
        notify({
            delay: 5 * SEC_60,
            type: 'danger',
            content: () =>
                <div className="text-red-500">
                    Произошла ошибка на сервере.
                    Попробуйте перезагрузить страницу немного позднее.
                </div>
        })
    }
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
