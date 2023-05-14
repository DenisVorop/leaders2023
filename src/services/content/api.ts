import { TPagination } from "@/types/types";
import { transliterate } from "@/utils/utils";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"

export enum ESortDirections { ASC = 'ASC', DESC = 'DESC', }
export enum EParams { NAME = 'name', AUTHOR = 'author', CREATED_AT = 'createdAt', SHORT_TEXT = 'short_text', }

export type TNewsRequest = {
    offset: number
    limit: number
    searchQuery: string
    param: EParams
    sortDirection: ESortDirections
}
type TNewsAttributes = {
    name: string
    author: string
    short_text: string
    full_text: string
    createdAt: string
    updatedAt: string
    publishedAt: string
}
export type TNewsResponse = {
    data: { id: number, attributes: TNewsAttributes & { img: { data: { attributes: { url: string } }[] } } }[],
    meta: { pagination: TPagination }
}
export interface INews extends TNewsAttributes { id: number, img: string | string[], tag: string }
export type TNewsData = { news: INews[], total: number }

export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: fetchBaseQuery({ baseUrl: 'http://77.232.137.109:1338/api' }),
    tagTypes: ["News", "Projects"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        getNews: builder.query<TNewsData, TNewsRequest>({
            query: ({ offset, limit, searchQuery, param, sortDirection }) => {
                const params = new URLSearchParams();
                params.set('pagination[start]', offset.toString());
                params.set('pagination[limit]', limit.toString());
                params.set('sort', `${param}:${sortDirection}`);
                params.set('_q', searchQuery);
                return {
                    url: `/news?${params}&populate=*`,
                    method: "GET",
                }
            },
            providesTags: ["News"],
            transformResponse: (response: TNewsResponse) => {
                return {
                    total: response.meta.pagination.total,
                    news: response.data.reduce((acc, cur) => {
                        const imgArray = cur.attributes.img.data.map(item => item.attributes.url)
                        acc.push({
                            ...cur.attributes,
                            id: cur.id,
                            img: imgArray.length > 1 ? imgArray : imgArray.join(''),
                            tag: transliterate(cur.attributes.name),
                        })
                        return acc
                    }, [] as INews[])
                }
            }
        }),
    })
})

export const {
    useGetNewsQuery,
} = contentApi
