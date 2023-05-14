

import { useEffect, useMemo } from "react"
import DashLayout from "../../layouts/dash"
import { useMeQuery } from "../../services/auth/api"


import posthog from "posthog-js"
import { useUserActivityQuery } from "../../services/activity/api"

import dynamic from "next/dynamic"

const Chat = dynamic(() => import("@/components/chat/main"), { ssr: false })


export default function Dash() {
  return <div>
    <PostHogPlayground />
  </div>
}


const PostHogPlayground = () => {
  const { data: session } = useMeQuery()

  const { data: activity } = useUserActivityQuery({
    userId: session?.email
  }, {
    skip: !session?.email
  })

  const gameStage = [1, 2]

  const capture = (id) => {
    posthog.identify(session?.email)
    posthog?.capture("read_ vacancy", {
      title: id
    })
  }

  const activeIcon = useMemo(() => <svg aria-hidden="true" className="w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>, [])

  const notactiveIcon = useMemo(() => <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg>, [])

  return <div className='flex flex-col gap-2'>
    <div className="flex flex-wrap gap-4 items-center">
    {gameStage.map((id) => <div id={id} className="max-w-sm h-fit p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Супер вакансия #{id}</h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Тут описание из текста</p>
      <button onClick={() => capture(id)} className="button">
        Откликнуться
      </button>
    </div>)}

    <ol className="relative text-gray-500">
      {activity?.actions?.results?.map((el, id) => <li key={el?.name} className="px-6">
        <h3 className="font-medium leading-tight">{el?.name} - {activity?.counts?.[id]?.count}</h3>
      </li>)}
    </ol>
    </div>
    <Chat />
  </div>
}


// Dash.auth = {
//     roles: ["user"],
//     verification: false,
//     permissions: []
// }

Dash.getLayout = page => <DashLayout>{page}</DashLayout>