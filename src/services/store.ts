import { PayloadAction, combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api as authApi } from "./auth/api"
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { useDispatch } from 'react-redux';
import { contentApi } from './content/api';


const combinedReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
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
  ]),
})

export type TStore = typeof store
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch


const makeStore = () => store


setupListeners(store.dispatch)

const config = { debug: process.env.NODE_ENV !== 'production' }
// const config = {}

// export default store
export const wrapper = createWrapper(makeStore, config)
