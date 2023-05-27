import { TPagination } from "@/types/types";
import { transliterate } from "@/utils/utils";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import omit from 'lodash/omit'

export enum ESortDirections { ASC = 'ASC', DESC = 'DESC', }
export enum ESortParams { NAME = 'name', AUTHOR = 'author', CREATED_AT = 'createdAt', SHORT_TEXT = 'short_text', }
export type TContentRequest = {
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
    test_task?: any
}

export type TNewsArticleData = { id: number, attributes: TNewsAttributes & { img: { data: { attributes: { url: string } }[] }, tags: { data: { attributes: { name: string } }[] } } }
export type TNewsResponse<T extends TNewsArticleData | TNewsArticleData[]> = { data: T, meta: { pagination: TPagination; } }
export interface INews extends Omit<TNewsAttributes, 'text'> { id: number, img: string | string[], tag: string, categories: string[] }
export interface INewsArticle extends TNewsAttributes { id: number, img: string | string[], tag: string, categories: string[] }
export type TNewsData = { news: INews[], total: number }

export type TProject = {
    name: string
    organizer: string
    short_text: string
    full_text?: string
    is_active: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    id: number
    tag: string
    categories: string[]
    tasks: string[]
    img: string[] | string
}
export type TProjectsData = { total: number, projects: TProject[] }

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
        getNews: builder.query<TNewsData, TContentRequest>({
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
        getProjects: builder.query<TProjectsData, TContentRequest>({
            query: ({ offset, limit, searchQuery, param, sortDirection }) => {
                const params = new URLSearchParams();
                params.set('pagination[start]', offset.toString());
                params.set('pagination[limit]', limit.toString());
                params.set('sort', `${param}:${sortDirection}`);
                params.set('_q', searchQuery);
                return {
                    url: `/projects?${params}&populate=*`,
                    method: "GET",
                }
            },
            providesTags: ["Projects"],
            transformResponse: (response: any) => {
                return {
                    total: response.meta.pagination.total,
                    projects: response.data.reduce((acc, cur) => {
                        const { id, attributes } = cur
                        const categories = attributes?.tags?.data?.map(item => item?.attributes?.name) || []
                        const tasks = attributes?.test_task?.data?.map(item => item?.attributes?.url) || []
                        acc.push({
                            ...omit(attributes, ['text', 'img', 'tags', 'test_task', 'full_text']),
                            id,
                            tag: `${transliterate(attributes.name)}-${id}`,
                            categories,
                            tasks,
                        })
                        return acc
                    }, [] as TProject[]),
                }
            }
        }),
        getProjectArticle: builder.query<TProject, { id: number }>({
            query: ({ id }) => {
                return {
                    url: `/projects/${id}?populate=*`,
                    method: "GET",
                }
            },
            providesTags: ["Projects"],
            transformResponse: (response: any) => {
                const { id, attributes } = response?.data || {}
                const imgArray = attributes?.img?.data?.map(item => item?.attributes?.url)
                const categories = attributes?.tags?.data?.map(item => item?.attributes?.name) || []
                const tasks = attributes?.test_task?.data?.map(item => item?.attributes?.url) || []
                return {
                    id,
                    ...omit(attributes, 'tags', 'test_task'),
                    img: imgArray.length > 1 ? imgArray : imgArray.join(''),
                    tag: `${transliterate(attributes.name)}-${id}`,
                    categories,
                    tasks,
                } as TProject
            }
        }),
    })
})

export const {
    useGetNewsQuery,
    useGetNewsArticleQuery,

    useGetProjectsQuery,
    useGetProjectArticleQuery,
} = contentApi
