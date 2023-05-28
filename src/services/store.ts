import { PayloadAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api as authApi } from "./auth/api"
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';
import { contentApi } from './content/api';
import { api as activityApi } from "./activity/api"
import { profileApi } from './profile/api';
import { testCasesApi } from './test-cases/api';
import { contentActionsApi } from './content/actions-api';
import { notificationApi } from './notification/api';


const combinedReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [activityApi.reducerPath]: activityApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [testCasesApi.reducerPath]: testCasesApi.reducer,
  [contentActionsApi.reducerPath]: contentActionsApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
});


export type RootState = ReturnType<typeof combinedReducer>
type Actions = PayloadAction<string, any>;


const reducer = (state: RootState, action: PayloadAction<Actions>) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    default:
      return combinedReducer(state, action);
  }
}


export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (gDM) => gDM().concat([
    authApi.middleware,
    contentApi.middleware,
    activityApi.middleware,
    profileApi.middleware,
    testCasesApi.middleware,
    contentActionsApi.middleware,
    notificationApi.middleware,
  ]),
})

export type TStore = typeof store
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch


const makeStore = () => store


setupListeners(store.dispatch)

// const config = { debug: process.env.NODE_ENV !== 'production' }
const config = {}

// export default store
export const wrapper = createWrapper(makeStore, config)
