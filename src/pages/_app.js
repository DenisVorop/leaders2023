/* eslint-disable react/display-name */
import "@/styles/globals.css";
import { NotifyProvider } from '@/services/notification/zustand';
// import store from "@/services/store"
import { Provider as StoreProvider } from "react-redux"
import Script from "next/script";

import { Mulish } from "next/font/google";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
// import Guard from '../services/auth/guard'
import Guard from '@/services/auth/guard'

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { wrapper } from "@/services/store";
import { useProgressBar } from "../hooks/use-progress-bar";

const font = Mulish({
  subsets: ["latin", 'cyrillic']
})


if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable debug mode in development
    autocapture: false,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

const transitionSpeed = 600;

export default function App({ Component, pageProps }) {
  const { store } = wrapper.useWrappedStore(pageProps);

  const router = useRouter()
  const { width, start, complete, reset } = useProgressBar({ transitionSpeed });

  useEffect(() => {
    const handleRouteChange = (...args) => {
      complete(...args)
      posthog?.capture("$pageview")
    }
    router.events.on("routeChangeComplete", handleRouteChange)
    router.events.on("routeChangeStart", start)
    router.events.on("routeChangeError", reset)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
      router.events.off("routeChangeStart", start)
      router.events.off("routeChangeError", reset)
    }
  }, [router])

  const getLayout = useMemo(() => {
    const getter = Component.getLayout ?? ((page) => page)
    return (page) => !Component.auth
      ? getter(page)
      : <Guard
        roles={Component.auth.roles ?? []}
        verification={Component.auth.verification ?? []}
      >
        {getter(page)}
      </Guard>
  }, [Component])

  return <StoreProvider store={store}>
    <PostHogProvider client={posthog}>
      <NotifyProvider>
        {width > 0 &&
          <div className="w-full absolute top-0 bg-gray-200 h-1 dark:bg-gray-700">
            <div className="bg-blue-600 h-1" style={{
              width: `${width}%`,
              transition: `width ${width > 1 ? transitionSpeed : 0}`
            }} />
          </div>
        }
        <main className={`${font.className} min-h-screen flex flex-col bg-center bg-no-repeat bg-[url('/background.webp')] bg-cover`}>
          {getLayout(<Component {...pageProps} />)}
        </main>
      </NotifyProvider>
    </PostHogProvider>
  </StoreProvider>
}
