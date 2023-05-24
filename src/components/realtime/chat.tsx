import { useChannel, usePresence } from '@ably-labs/react-hooks'

import { useState, useEffect, useMemo, useReducer, FC, createContext, useContext, useRef, ReactElement } from 'react'
import { useMeQuery } from '../../services/auth/api'
import { configureAbly } from "@ably-labs/react-hooks";
import Image from 'next/image';
import { useCredentialsStore } from '@/services/auth/persister';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from 'flowbite-react';

import { EChannel, ERealtimeRole, EStatus, ETopic } from '@/types/integrations';



/*
петух овнер бетоная стена пупсечек
эффективный
десептикон

   ADMIN = "admin"
    CANDIDATE = "candidate"
    INTERN = "intern"
    HR_MANAGER = "hr_manager"
    CURATOR = "curator"
    MENTOR = "mentor"


      <button type="button" className="card shadow-2xl rounded-2xl inline-flex itemx-center justify-center button relative w-[56px] h-[56px] text-gray-500 bg-white border border-gray-200 hover:text-gray-900 dark:border-gray-600  dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                <div className="text-lg font-bold items-center justify-center"><UserCheck /></div>
                <span className="absolute card py-1 px-2 block mb-px text-sm font-medium -translate-y-1/2 -left-28 top-1/2">Кандидаты</span>
              </button>
              <button type="button" className="card shadow-2xl rounded-2xl inline-flex itemx-center justify-center button relative w-[56px] h-[56px] text-gray-500 bg-white border border-gray-200 dark:border-gray-600 hover:text-gray-900  dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                <div className="text-lg font-bold items-center justify-center"><UserLike /></div>
                <span className="absolute card py-1 px-2 block mb-px text-sm font-medium -translate-y-1/2 -left-28 top-1/2">Кураторы</span>
              </button>
              <button type="button" className="card shadow-2xl rounded-2xl inline-flex itemx-center justify-center button relative w-[56px] h-[56px] text-gray-500 bg-white border border-gray-200 hover:text-gray-900 dark:border-gray-600  dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                <div className="text-lg font-bold items-center justify-center"><UserAdmin /></div>
                <span className="absolute card py-1 px-2 block mb-px text-sm font-medium -translate-y-1/2 -left-28 top-1/2">Руководство</span>
              </button>

*/



configureAbly({
  authUrl: "/api/realtime/auth",
  autoConnect: true,
  authHeaders: {
    "X-Ably-Validate": typeof window === 'undefined' ? "" : useCredentialsStore.getState()?.accessToken
  }
})


interface IRoom {
  title: ERealtimeRole | EChannel,
  icon: ReactElement
}

const getChatRoomsByRole = (role?: string): IRoom[] => {
  return [
    { title: EChannel.global, icon: <Wow className="w-16 h-16 fill-main" /> },
    { title: ERealtimeRole.Candidate, icon: <UserCheck className="w-16 h-16 fill-main" /> },
    { title: ERealtimeRole.Curator, icon: <UserAdmin className="w-16 h-16 fill-main" /> },
    { title: ERealtimeRole.Mentor, icon: <UserLike className="w-16 h-16 fill-main" /> },
  ]
}
//
interface ChatContextValue {
  messages: IMessage[];
  user: any;
  sendMessage: (e: React.FormEvent) => void;
  onRemove: (e: any) => void,
  onReact?: (e: any, e2: any) => void
}

type MessageSendEvent = { type: IRoom["title"] } & IMessage
type MessageDeleteEvent = { type: 'com.ably.delete';[key: string]: any }
type MessageClearEvent = { type: 'com.ably.clear';[key: string]: any }
type MessageReactionEvent = { type: 'com.ably.reaction';[key: string]: any }

type MessageDispatch = MessageSendEvent | MessageReactionEvent | MessageDeleteEvent | MessageClearEvent

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};
//


const Room: FC<{ channelName?: EChannel, topicName?: ETopic }> = ({ channelName = EChannel.global, topicName = ETopic.global }) => {
  const { messages, user, onRemove, onReact } = useChat()
  return <>
    {
      messages.map((msg: IMessage) => <Message
        key={msg.timestamp}
        timestamp={msg.timestamp}
        mine={user.author === msg.username}
        text={msg.text}
        username={msg.username}
        logoUrl={user.logo}
        deleted={msg.deleted}
        reactions={msg.reactions}
        onReact={(isLike: boolean) => onReact(msg.mid, isLike)}
        onRemove={[ERealtimeRole.Candidate, ERealtimeRole.Curator, ERealtimeRole.HR, ERealtimeRole.Mentor].includes(user.role) ? () => void onRemove(msg.mid) : null}
      />)
    }
  </>
}


const Chat: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [availableRooms, setAvailableRooms] = useState(() => getChatRoomsByRole())
  const [curChannel, setCurChannel] = useState<IRoom["title"]>(EChannel.global)
  const [curTopic, setCurTopic] = useState(ETopic.global)
  const chatContainerRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
  };
  const scrollToLastMessage = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };


  const user = useMeQuery(undefined, {
    selectFromResult: ({ data }: any) => {
      return {
        author: data?.email ?? "default_user",
        logo: "https://avatars.yandex.net/get-yapic/31804/ZMBm4j3Gqi6Yu5QtxDQ2Hr7botk-1/islands-200",
        role: data?.role
      }
    }
  })

  const messageReducer = (
    state: IMessage[],
    action: MessageDispatch
  ): IMessage[] => {
    switch (action.type) {
      case 'com.ably.clear':
        return []
      case 'com.ably.reaction':
        return state.map((m: IMessage) => m.mid !== action.extras.ref.timeserial ? m : {
          ...m,
          reactions: [+action.like + m.reactions[0] , +action.dislike + m.reactions[1]]
        })
      case "com.ably.delete":
        return state.map((_m: IMessage) => {
          const m: IMessage = {
            text: _m.text,
            logoUrl: _m.logoUrl,
            timestamp: _m.timestamp,
            username: _m.username,
            mid: _m.mid,
            reactions: _m.reactions,
            deleted: _m.deleted
          }
          return !(m.username !== user.author && action.extras?.userClaim === 'user') && m.mid === action.extras.ref.timeserial
            ? { ...m, deleted: true }
            : m
        })
      default: {
        return [...state, {
          text: action.text,
          logoUrl: action.logoUrl,
          timestamp: action.timestamp,
          username: action.username,
          mid: action.mid,
          reactions: [0, 0],
          deleted: action.deleted
        }]
      }
    }
  }



  const [messages, dispatchMessage] = useReducer(messageReducer, [])

  const handleMessage = (msg: any) => {
    dispatchMessage({ type: msg?.data?.extras?.ref?.type ?? msg.name, mid: msg.extras.timeserial, extras: msg.extras, ...msg.data })
  }

  const [draft, setDraft] = useState("")
  const [channel] = useChannel(curChannel, curTopic, (message) => {
    handleMessage(message)
  })
  useEffect(() => {
    chatContainerRef.current && scrollToLastMessage();
  }, [messages, chatContainerRef]);

  useEffect(() => {
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    channel.history({ start: oneDayAgo.getTime(), end: currentDate.getTime() }, (err: any, result) => {
      dispatchMessage({ type: "com.ably.clear" })
      result.items.reverse().forEach(handleMessage)
    })
  }, [channel])

  const [precense, updateStatus] = usePresence(curChannel, { topic: curTopic, status: EStatus.init }, (update: any) => { });

  const precenseCount = useMemo(() => {
    return precense.filter(p => p.action === "present").length
  }, [precense])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (draft.length === 0) return
    channel.publish(curTopic, {
      username: user.author,
      logoUrl: user.logo,
      text: draft,
      timestamp: new Date().getTime()
    } as IMessage)
    setDraft("")
    scrollToLastMessage()
  }

  const onReact = (mid: any, isLike = true) => {
    channel.publish(curTopic, {
      like: isLike,
      dislike: !isLike,
      extras: {
        ref: { type: 'com.ably.reaction', timeserial: mid },
      },
    })
  }

  const onRemove = (mid: any) => {
    channel.publish(curTopic, {
      username: user.author,
      logoUrl: user.logo,
      text: null,
      timestamp: new Date().getTime(),
      extras: {
        ref: { type: 'com.ably.delete', timeserial: mid },
      },
    })
  }

  if (channel.state === "failed") {
    return <div className="text-xl caret-red-300 text-red-200">ERROR!!</div>
  }
  if (channel.state === "attaching") {
    return <div>attaching...</div>
  }



  return <section className="p:2 sm:p-6 max-w-2xl -space-y-8  h-fit">
    <AnimatePresence>
      {isOpen && <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative card bg-gray-100 px-1 shadow-2xl ml-20 mr-4">
          <div className="card shadow top-0 px-5 absolute py-2 inset-x-0 z-50 rounded-b-none">
            <div className='flex gap-2 items-center'>
              <div className="relative self-start">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image alt="alt text" src={user.logo} fill />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="font-bold text-sm">{user.author} (Вы)</span>
                <div className="text-gray-500 font-semibold text-xs inline-flex items-center justify-between">
                  <div>{user.role}</div>
                  <Badge color="green">Чат: {curChannel}</Badge>
                  <div className="flex items-center gap-1">
                    <svg className="ring-white rounded-full ring-2 animate-pulse" width="8" height="8" >
                      <circle cx="8" cy="8" r="16" className="fill-green-400"></circle>
                    </svg>
                    <div className="text-green-800">{precenseCount} онлайн</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <ChatContext.Provider value={{ messages, sendMessage, user, onRemove, onReact }}>
            <div ref={chatContainerRef} className="card bg-inherit pr-6 pl-4 h-96 flex flex-col space-y-4  overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-1 scrolling-touch">
              <Room />
            </div>
          </ChatContext.Provider>
        </div>
      </motion.div>
      }
    </AnimatePresence>
    <div className="inline-flex card py-2 px-4 gap-3 items-center">

      <div className="relative group">
        <AnimatePresence>
          {isOpen && <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex absolute bottom-16 py-2 flex-col items-center space-y-2">
              {
                availableRooms.map(({ icon, title }: IRoom) => <button  onClick={() => setCurChannel(title)} key={title} type="button" className="card shadow-2xl rounded-2xl inline-flex itemx-center justify-center button relative w-[56px] h-[56px] text-gray-500 bg-white border border-gray-200 hover:text-gray-900 dark:border-gray-600  dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                  <div className={`${curChannel === title ? "animate-bounce" : ""} text-lg font-bold items-center justify-center`}>{icon}</div>
                  <span className="absolute card py-1 px-2 block mb-px text-sm font-medium -translate-y-1/2 -left-28 top-1/2">{title}</span>
                </button>)
              }
            </div>
          </motion.div>}
        </AnimatePresence>
        <button onClick={() => void setIsOpen(!isOpen)} type="button" className="button rounded-2xl flex items-center justify-center text-white w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
          <svg aria-hidden="true" className="w-6 h-6 transition-transform group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          <span className="sr-only">Open actions menu</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && <motion.div
          initial={{ opacity: 1, width: "0%" }}
          animate={{ opacity: 1, width: "100%" }}
          exit={{ opacity: 0, width: "0%" }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >

          <form onSubmit={sendMessage} className="inline-flex w-full  gap-3 items-center">
            <input placeholder="Ваш текст тут" className="input w-full flex-1" value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button type="submit" className="button inline-flex">
              <span className="font-bold">Отправить</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
        </motion.div>}
      </AnimatePresence>

    </div>
  </section>
}

interface IMessage {
  text: string,
  logoUrl: string,
  timestamp: string | number,
  username: string,
  mid?: string | number,
  deleted?: boolean,
  extras?: any
  reactions: [number, number]
}

type TMessageProps = IMessage & { mine: boolean; onRemove: (id: any) => void, onReact: (isLike: boolean) => void }

const Message: FC<TMessageProps> = ({ text, deleted, logoUrl, reactions, onRemove, onReact, timestamp, username, mine = false, }) => {

  return <div className={`flex  gap-3 ${mine ? "justify-end" : "justify-start"}`}>
    {!mine && <div className="relative self-start">
      <div className="relative w-10 h-10 p-2 rounded-full overflow-hidden">
        <Image alt="alt text" src={logoUrl} fill />
      </div>
      <span className="text-green-300 rounded-full absolute w-2 h-2 right-0 bottom-0">
        <svg className="ring-white rounded-full ring-2 animate-pulse" width="10" height="10" >
          <circle cx="8" cy="8" r="16" fill="currentColor"></circle>
        </svg>
      </span>
    </div>
    }
    <div className="flex flex-col max-w-[75%] gap-1">
      <div className="inline-flex font-bold items-center gap-1 text-[10px] text-gray-400">
        <span>{mine ? "Вы" : username}</span>
        <span className=''>&#183;</span>
        <span>{formatTimeAgo(new Date(timestamp))}</span>
      </div>
      <div className="relative card bg-white max-w-[w/2] rounded-xl p-2">
        {!deleted ? <p className="text-xs font-serif text-gray-800 break-all">{text}</p> : <div className="px-2 py-1 text-[10px] bg-red-100">сообщение было удалено</div>}
        <div className="absolute -bottom-1 -right-3 -space-x-1 flex items-center">
          <Check />
          <Check />
        </div>
      </div>
      <div className="inline-flex items-center justify-between">
        <div className="inline-flex items-center px-1 gap-2">
          <button onClick={() => !mine && onReact(true)} className="group flex items-center">
            <Happy className="w-4 h-4 fill-green-200 group-hover:animate-bounce group-hover:cursor-pointer" />
            <Badge color="green" className="group-hover:opacity-80">{reactions?.[0] ?? 0}</Badge>
          </button>
          <button onClick={() => !mine && onReact(false)} className='group flex items-center'>
            <Sad className="w-4 h-4 fill-red-400 group-hover:animate-bounce group-hover:cursor-pointer" />
            <Badge color="red" className="group-hover:opacity-80">{reactions?.[1] ?? 0}</Badge>
          </button>
          {/* <Wow className="w-4 h-4 fill-yellow-200 hover:animate-bounce hover:cursor-pointer"/> */}
          {/* <Angry className="w-4 h-4 fill-red-400 hover:animate-bounce hover:cursor-pointer"/> */}
        </div>
        
        {!deleted && onRemove && <div className="flex items-start justify-end">
          <Badge onClick={onRemove} className="text-[8px] w-fit hover:cursor-pointer hover:bg-red-200 focue " color='red'>удалить</Badge>
        </div>
        }
      </div>
    </div>
  </div>

}

const Check = () => <svg viewBox="0 0 48 48" className="fill-green-500" width="8px" height="8px"><path d="M 42.960938 8.9804688 A 2.0002 2.0002 0 0 0 41.585938 9.5859375 L 17 34.171875 L 6.4140625 23.585938 A 2.0002 2.0002 0 1 0 3.5859375 26.414062 L 15.585938 38.414062 A 2.0002 2.0002 0 0 0 18.414062 38.414062 L 44.414062 12.414062 A 2.0002 2.0002 0 0 0 42.960938 8.9804688 z" /></svg>
const UserAdmin = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.77 17.671L11.16 16.141L9.66 14.721L11.66 14.431L13.91 14.111L14.2 13.541C14.194 13.541 14.187 13.541 14.18 13.541C13.698 13.541 13.296 13.201 13.201 12.747C13.2 12.13 14 12.33 14.63 11.29C14.71 11.27 17.45 4 11.85 4C6.25 4 8.99 11.27 8.99 11.27C9.62 12.27 10.43 12.12 10.42 12.72C10.41 13.32 9.68 13.52 8.99 13.59C7.85 13.72 6.85 13.46 5.85 15.35C5.25 16.44 5 20 5 20H12.36V19.83L12.77 17.671Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M15.57 20.001H16.13L15.85 19.861L15.57 20.001Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M15.85 18.7309L18.32 20.0009L17.85 17.3109L19.85 15.4109L17.09 15.0209L15.85 12.5709L14.61 15.0209L11.85 15.4109L13.85 17.3109L13.38 20.0009L15.85 18.7309Z" fill="#1C2E45" fill-opacity="0.6" />
</svg>


const UserLike = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18.1 20H18.7C18.7 20 18.7 19.8 18.7 19.4L18.1 20Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M12.5 17.9C11.8 17.2 11.5 16.1 11.7 15.1C11.9 14.1 12.5 13.3 13.4 13C13.4 12.9 13.3 12.8 13.3 12.8C13.3 12.2 14.1 12.4 14.7 11.3C14.7 11.3 17.4 4 11.8 4C6.3 4 9 11.3 9 11.3C9.6 12.3 10.4 12.1 10.4 12.8C10.4 13.5 9.7 13.5 9 13.6C7.9 13.7 6.9 13.5 5.9 15.3C5.3 16.4 5 20 5 20H14.6L12.5 17.9Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M18.8 14.1C18.6 14 18.3 14 18.1 14C17.4 14 16.8 14.6 16.4 15.1C16 14.6 15.4 14 14.7 14C14.4 14 14.2 14 14 14.1C12.8 14.5 12.6 16.1 13.5 17L16.5 19.9L19.5 17C20.3 16.1 20 14.5 18.8 14.1Z" fill="#1C2E45" fill-opacity="0.6" />
</svg>

const UserCheck = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.4 18.4C10.6 17.6 10.6 16.4 11.4 15.6C12.2 14.8 13.4 14.8 14.2 15.6L14.8 16.2L16.7 14.1C16 13.7 15.4 13.7 14.7 13.7C14 13.6 13.3 13.4 13.3 12.8C13.3 12.2 14.1 12.4 14.7 11.3C14.7 11.3 17.4 4 11.8 4C6.3 4 9 11.3 9 11.3C9.6 12.3 10.4 12.1 10.4 12.8C10.4 13.5 9.7 13.5 9 13.6C7.9 13.7 6.9 13.5 5.9 15.3C5.3 16.4 5 20 5 20H13L11.4 18.4Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M16.7 20H18.8C18.8 20 18.7 19.1 18.6 18L16.7 20Z" fill="#1C2E45" fill-opacity="0.6" />
  <path d="M14.9 20C14.6 20 14.4 19.9 14.2 19.7L12.2 17.7C11.8 17.3 11.8 16.7 12.2 16.3C12.6 15.9 13.2 15.9 13.6 16.3L14.9 17.6L18.2 14C18.6 13.6 19.2 13.6 19.6 13.9C20 14.3 20 14.9 19.7 15.3L15.7 19.6C15.4 19.9 15.2 20 14.9 20Z" fill="#1C2E45" fill-opacity="0.6" />
</svg>

const Happy = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" stroke="#222222" stroke-linecap="round" />
  <path d="M8.20857 15.378C8.63044 15.7433 9.20751 16.0237 9.86133 16.2124C10.5191 16.4023 11.256 16.5 12 16.5C12.744 16.5 13.4809 16.4023 14.1387 16.2124C14.7925 16.0237 15.3696 15.7433 15.7914 15.378" stroke="#222222" stroke-linecap="round" />
  <circle cx="9" cy="10" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
  <circle cx="15" cy="10" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
</svg>
const Angry = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" stroke="#222222" stroke-linecap="round" />
  <path d="M8.20857 16.622C8.63044 16.2567 9.20751 15.9763 9.86133 15.7876C10.5191 15.5977 11.256 15.5 12 15.5C12.744 15.5 13.4809 15.5977 14.1387 15.7876C14.7925 15.9763 15.3696 16.2567 15.7914 16.622" stroke="#222222" stroke-linecap="round" />
  <path d="M17 8L14 10" stroke="#222222" stroke-linecap="round" />
  <path d="M7 8L10 10" stroke="#222222" stroke-linecap="round" />
  <circle cx="8" cy="10" r="1" fill="#222222" />
  <circle cx="16" cy="10" r="1" fill="#222222" />
</svg>
const Sad = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" stroke="#222222" stroke-linecap="round" />
  <path d="M8.20857 16.622C8.63044 16.2567 9.20751 15.9763 9.86133 15.7876C10.5191 15.5977 11.256 15.5 12 15.5C12.744 15.5 13.4809 15.5977 14.1387 15.7876C14.7925 15.9763 15.3696 16.2567 15.7914 16.622" stroke="#222222" stroke-linecap="round" />
  <circle cx="9" cy="10" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
  <circle cx="15" cy="10" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
</svg>
const Wow = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="9.5" stroke="#222222" stroke-linecap="round" />
  <circle cx="9" cy="9" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
  <circle cx="15" cy="9" r="1" fill="#222222" stroke="#222222" stroke-linecap="round" />
  <path d="M15 15.5C15 16.8807 13.6569 18 12 18C10.3431 18 9 16.8807 9 15.5C9 14.1193 10.3431 13 12 13C13.6569 13 15 14.1193 15 15.5Z" fill="#222222" />
</svg>




function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diff = Math.abs(now.getTime() - timestamp.getTime());

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    const seconds = Math.round(diff / 1000);
    return `${seconds} ${seconds === 1 ? 'секунду' : 'секунд'} назад`;
  } else if (diff < hour) {
    const minutes = Math.round(diff / minute);
    return `${minutes} ${minutes === 1 ? 'минуту' : 'минуты'} назад`;
  } else if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours} ${hours === 1 ? 'час' : 'часа'} назад`;
  } else if (diff < month) {
    const days = Math.round(diff / day);
    return `${days} ${days === 1 ? 'день' : 'дня'} назад`;
  } else if (diff < year) {
    const months = Math.round(diff / month);
    return `${months} ${months === 1 ? 'месяц' : 'месяца'} назад`;
  } else {
    const years = Math.round(diff / year);
    return `${years} ${years === 1 ? 'год' : 'года'} назад`;
  }
}





export default Chat;
