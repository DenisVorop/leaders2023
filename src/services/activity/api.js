import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({baseUrl: "/api/activity"}),
  tagTypes: ["Activity"],
  endpoints: (builder) => ({
    userActivity: builder.query({
      query: (query) => ({ url: `/actions?userId=${query?.userId ?? ""}` }),
      providesTags: ["Activity"],
    })
  })
});

export const {
  useUserActivityQuery
} = api;
