import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api as authApi } from "./auth/api"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})


setupListeners(store.dispatch)

export default store