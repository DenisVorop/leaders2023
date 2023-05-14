import { TPagination } from "@/types/types";
import { transliterate } from "@/utils/utils";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import omit from 'lodash/omit'

export enum ESortDirections { ASC = 'ASC', DESC = 'DESC', }
export enum ESortParams { NAME = 'name', AUTHOR = 'author', CREATED_AT = 'createdAt', SHORT_TEXT = 'short_text', }
export type TNewsRequest = {
    offset: number
    limit: number
    searchQuery: string
    param: ESortParams
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

export type TNewsArticleData = { id: number, attributes: TNewsAttributes & { img: { data: { attributes: { url: string } }[] }, tags: { data: { attributes: { name: string } }[] } } }
export type TNewsResponse<T extends TNewsArticleData | TNewsArticleData[]> = { data: T, meta: { pagination: TPagination; } }
export interface INews extends Omit<TNewsAttributes, 'text'> { id: number, img: string | string[], tag: string, categories: string[] }
export interface INewsArticle extends TNewsAttributes { id: number, img: string | string[], tag: string, categories: string[] }
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
            transformResponse: (response: TNewsResponse<TNewsArticleData[]>) => {
                return {
                    total: response.meta.pagination.total,
                    news: response.data.reduce((acc, cur) => {
                        const { id, attributes } = cur
                        const imgArray = attributes.img.data.map(item => item.attributes.url)
                        const categories = attributes.tags.data.map(item => item.attributes.name)
                        acc.push({
                            ...omit(attributes, 'text'),
                            id,
                            img: imgArray.length > 1 ? imgArray : imgArray.join(''),
                            tag: `${transliterate(attributes.name)}-${id}`,
                            categories,
                        })
                        return acc
                    }, [] as INews[])
                }
            }
        }),
        getNewsArticle: builder.query<INewsArticle, { id: number }>({
            query: ({ id }) => {
                return {
                    url: `/news/${id}?populate=*`,
                    method: "GET",
                }
            },
            providesTags: ["News"],
            transformResponse: (response: TNewsResponse<TNewsArticleData>) => {
                const { id, attributes } = response.data
                const imgArray = attributes.img.data.map(item => item.attributes.url)
                const categories = attributes.tags.data.map(item => item.attributes.name)
                return {
                    id,
                    ...omit(attributes, 'tags'),
                    img: imgArray.length > 1 ? imgArray : imgArray.join(''),
                    tag: `${transliterate(attributes.name)}-${id}`,
                    categories,
                }
            }
        }),
    })
})

export const {
    useGetNewsQuery,
    useGetNewsArticleQuery,
} = contentApi
