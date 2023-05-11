import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useCredentialsStore = create(persist(
  (set, get) => ({
    accessToken: null,
    refreshToken: null,
    persistToken: (token) => {
      set({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      })
    },
    loggedOut: () => {
      set({
        accessToken: null,
        refreshToken: null,
      })
    }

  }),
  {
    name: "session-storage",
    storage: createJSONStorage(() => localStorage)
  }
))
