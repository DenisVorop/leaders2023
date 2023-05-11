import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { useCredentialsStore } from "@/services/auth/persister";

useCredentialsStore.subscribe(console.log)

const persistToken = (token) => {
  useCredentialsStore.setState(state => ({
    ...state,
    accessToken: token?.access_token,
    refreshToken: token?.refresh_token
  }))
}

const loggedOut = () => {
  useCredentialsStore.setState(state => ({
    ...state,
    accessToken: null,
    refreshToken: null
  }))
}

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "/partner",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const { accessToken, refreshToken } = useCredentialsStore.getState()
    if (endpoint === "refresh" && refreshToken) {
      headers.set("authorization", `Bearer ${refreshToken}`);
      return headers;
    }
    if (accessToken && !headers?.authorization) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
          },
          { ...api, endpoint: "refresh" },
          extraOptions
        );
        if (refreshResult.data) {
          persistToken(refreshResult.data);
          result = await baseQuery(args, api, extraOptions);
        } else {
          loggedOut();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Stats"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => {
        return {
          url: "/auth/login",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const token = await queryFulfilled;
          persistToken(token.data);
          dispatch(api.util.invalidateTags([{ type: "User" }]));
        } catch {}
      },
    }),
    signup: builder.mutation({
      query: (body) => ({ url: `/auth/sign-up`, method: "POST", body }),
    }),
    logout: builder.mutation({
      query: (body) => ({ url: `/auth/logout`, method: "POST" }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          loggedOut();
          dispatch(api.util.invalidateTags([{ type: "User" }]));
          dispatch(api.util.invalidateTags([{ type: "Stats" }]));
        } catch {}
      },
    }),
    approve: builder.mutation({
      query: (body) => ({ url: `/auth/send-email-confirmation`, method: "GET" }),
    }),
    confirm: builder.query({
      query: (token) => ({ url: `/auth/confirm-email`, method: "PUT", body: { token } }),
    }),
    forgot: builder.mutation({
      query: (body) => ({ url: `/auth/forgot-password`, method: "POST", body }),
    }),
    resetPass: builder.mutation({
      query: (body) => ({ url: `/auth/reset-password`, method: "PUT", body }),
    }),
    changePass: builder.mutation({
      query: (body) => ({ url: `/auth/change-password`, method: "PUT", body }),
    }),
    // refresh: builder.mutation({
    //   query: (body) => {
    //     const refresh_token = JSON.parse(
    //       localStorage.getItem("user")
    //     )?.refresh_token;
    //     return {
    //       url: `/auth/refresh`,
    //       method: "POST",
    //       headers: {
    //         authorization: `Bearer ${refresh_token}`,
    //       },
    //     };
    //   },
    // }),
    me: builder.query({
      query: () => ({ url: `/auth/get-me` }),
      providesTags: ["User"],
    })
  })
});

export const {
  useMeQuery,
  useRefreshMutation,
  useApproveMutation,
  useLogoutMutation,
  useLoginMutation,
  useSignupMutation,
  useForgotMutation,
  useResetPassMutation,
  useChangePassMutation,
  useConfirmQuery
} = api;
