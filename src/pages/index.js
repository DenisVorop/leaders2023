import { useEffect } from "react";
import { useMeQuery } from "../services/auth/api";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter()
  const { data: session, isSuccess, isError } = useMeQuery()

  useEffect(() => {
    if (!!session && isSuccess) {
        router.push('/dashboard')
    }
  }, [isSuccess, session])

  useEffect(() => {
    if (isError) {
        router.push('/auth/login')
    }
  }, [isError])

  return null

}
