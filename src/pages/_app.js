import "@/styles/globals.css";
import { NotifyProvider } from '@/services/notification/zustand';

import store from "@/services/store"
import { Provider as StoreProvider } from "react-redux"

import { Montserrat } from "next/font/google";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Guard from "@/services/auth/guard";

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

const font = Montserrat({
  subsets: ["latin"]
})

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => posthog?.capture("$pageview")
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])
  
  const getLayout = useMemo(() => {
    const getter = Component.getLayout ?? ((page) => page)
    return (page) => !Component.auth ? getter(page) : <Guard
      roles={Component.auth.roles ?? []}
      verification={Component.auth.verification ?? []}
    >
      {getter(page)}
    </Guard>
  }, [Component, pageProps])

  return <StoreProvider store={store}>
    <PostHogProvider client={posthog}>
    <NotifyProvider>
      <main className={`flex min-h-screen items-center justify-between p-24 ${font.className}`}>
        {getLayout(<Component {...pageProps} />)}
      </main>
    </NotifyProvider>
    </PostHogProvider>
  </StoreProvider>
}
