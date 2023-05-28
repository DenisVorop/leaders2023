import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper"
import { secureQueryBuilder } from "../auth/api";
import { PORTS } from "@/utils/paths";

const baseQuery = secureQueryBuilder(`https://mycareer.fun${PORTS.notification_port}/`);

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery,
    tagTypes: ["Notify"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === HYDRATE) {
            return action.payload[reducerPath]
        }
    },
    endpoints: (builder) => ({
        getNotificationKey: builder.query<{ link: string, token: string }, null>({
            query: () => {
                return {
                    url: `/key/`,
                    method: "GET",
                }
            },
            providesTags: ["Notify"],
        }),
    })
})

export const {
    useGetNotificationKeyQuery,
} = notificationApi
