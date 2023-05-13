import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { api as authApi } from "./auth/api"
import { api as activityApi } from "./activity/api"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production', 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, activityApi.middleware),
})


setupListeners(store.dispatch)

export default store