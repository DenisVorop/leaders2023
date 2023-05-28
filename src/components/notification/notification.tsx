import pushApi from "@/services/notification/webpush/client-register"
import { useNotify } from '@/services/notification/zustand'
import { useState, useEffect, FC, useReducer, useRef, memo } from 'react'

import { configureAbly } from "@ably-labs/react-hooks";
import { useMeQuery } from '../../services/auth/api'
import { EChannel, ERealtimeRole, EStatus, ETopic } from '@/types/integrations';
import { useChannel, usePresence } from '@ably-labs/react-hooks'


import useOutsideAlerter from "@/hooks/use-outside-alerter"
import Link from "next/link";
import Icons from "../icons";

import { formatTimeAgo } from '@/utils/utils';

const notificationReducer = (
  state: any,
  action: any
): any => {
  switch (action.type) {
    case "show": {
      return [...state, {message: action.message, timestamp: action.timestamp}]
    }
    case "clear": {
      return []
    }
    default: {
      return [...state, {message: action.message, timestamp: action.timestamp}]
    }
  }
}


const Notification: FC = () => {
  const { data: session, isLoading } = useMeQuery(undefined)
  const [sub, setSub] = useState(null)
  const [notify] = useNotify()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && ((window as any)?.workbox) !== undefined) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setSub(sub)
          }
        })
      })
    }
  }, [])
  const register = () => {
    pushApi.registerWebPush(
      { userUID: session?.email, topic: "global" },
      (sub: any) => {
        setSub(sub)
        notify({ type: "success", content: () => <div>Подписался на уведомления</div> })
      },
      () => {
        notify({ type: "warning", content: () => <div>Ошибка подписки на webpush</div> })
      }
    )
  }
  const unregister = () => {
    pushApi.unregisterWebPush(
      sub,
      () => void notify({ type: "success", content: () => <div>Отписался от уведомлений</div> }),
      () => void notify({ type: "warning", content: () => <div>Ошибка отписки с webpush</div> })
    )
    setSub(null)
  }

  const [notifications, dispatchNotification] = useReducer(notificationReducer, [])
  const handleMessage = (msg: any) => {
    dispatchNotification({ type: "show", message: msg.data, timestamp: msg.timestamp })
  }
  const [channel] = useChannel(EChannel.notification, "global", (message) => {
    handleMessage(message)
  })


  useEffect(() => {
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    channel.history({limit: 5, start: oneDayAgo.getTime(), end: currentDate.getTime() }, (err: any, result) => {
      result.items.forEach(handleMessage)
    })

  }, [channel])

  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  useOutsideAlerter([ref], () => setOpen(false))

  if (isLoading || !session?.email) {
    return null
  }

  return (
    <div className="relative flex items-center gap-3 juftify-between px-3">
      {!sub && <button onClick={register} className="button">Подписаться на уведомления</button>}
      {sub && <> <button onClick={(e: any) => {
        e.stopPropagation()
        setOpen(!open)
      }} className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400" type="button">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
        <div className="relative flex">
          <div className="relative inline-flex w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-2 right-3 dark:border-gray-900"></div>
        </div>
      </button>
        {open && <div ref={ref} className="absolute right-0 top-[32px]  origin-top-right card py-0 px-0 z-[100] w-fit max-w-sm bg-white divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700" aria-labelledby="dropdownNotificationButton">
          <div className="flex items-center gap-3 px-4 py-2 w-full justify-between font-medium text-center text-gray-700 rounded-t-3xl bg-gray-50 dark:bg-gray-800 dark:text-white">
            <div>Оповещения</div>
            <button onClick={(e: any) => {
              e.stopPropagation()
              unregister()
            }} className="button py-1 px-2 text-sm">Отписаться</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification: any, key: any) => <Link key={key} href="#" className="flex md:w-96 w-64 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex-shrink-0">
                <Icons.Group className="rounded-fullw-8 h-8 fill-white"/>
              </div>

              <div className="w-full pl-3">
                <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">{notification.message}</div>
                <div className="text-[10px] text-blue-400 dark:text-blue-300">{formatTimeAgo(new Date(notification.timestamp))}</div>
              </div>
            </Link>
            )}
          </div>
          <div onClick={() => setOpen(false)} className="hover:cursor-pointer block py-2 text-sm font-medium text-center text-gray-900 rounded-b-3xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
            <div className="inline-flex items-center ">
              Закрыть
            </div>
          </div>

        </div>
        }
      </>
      }
    </div>
  )
}

export default memo(Notification);
