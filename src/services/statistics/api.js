import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "statisticsApi",
  baseQuery: fetchBaseQuery({baseUrl: "/api/insights"}),
  tagTypes: ["Insight"],
  endpoints: (builder) => ({
    insights: builder.query({
      query: (query) => {
        return {
          method: "POST",
          url: "/trends",
          body: query
        }
      },
      providesTags: ["Insight"],
    })
  })
});

export const {
  useInsightsQuery
} = api;
