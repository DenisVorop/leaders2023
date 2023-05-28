import { useChannel, usePresence } from '@ably-labs/react-hooks'

import { useState, useEffect, useMemo, useReducer, FC, createContext, useContext, useRef, ReactElement } from 'react'
import { useMeQuery } from '../../services/auth/api'
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from 'flowbite-react';

import { EChannel, ERealtimeRole, EStatus, ETopic } from '@/types/integrations';
import Icons from "@/components/icons"
import { formatTimeAgo } from '@/utils/utils';

interface IRoom {
    title: ERealtimeRole | EChannel,
    icon: ReactElement
}

const getChatRoomsByRole = (role?: string): IRoom[] => {
    return [
        { title: EChannel.global, icon: <Icons.Group className="w-12 h-12 fill-purple-600" /> },
        { title: ERealtimeRole.Candidate, icon: <Icons.UserCheck className="w-10 h-10 fill-purple-600 " /> },
        { title: ERealtimeRole.Curator, icon: <Icons.UserAdmin className="w-10 h-10 fill-purple-600" /> },
        { title: ERealtimeRole.Mentor, icon: <Icons.UserLike className="w-10 h-10 fill-purple-600" /> },
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
            messages?.map((msg: IMessage) => <Message
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

const ChannelNameMapper = {
    [ERealtimeRole.Candidate]: "Кандидаты",
    [ERealtimeRole.Curator]: "Кураторы",
    [ERealtimeRole.Mentor]: "Менторы",
    [EChannel.global]: "Общий"

}

const Chat: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
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
                return state?.map((m: IMessage) => m.mid !== action.extras.ref.timeserial ? m : {
                    ...m,
                    reactions: [+action.like + m.reactions[0], +action.dislike + m.reactions[1]]
                })
            case "com.ably.delete":
                return state?.map((_m: IMessage) => {
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
        return precense.filter(p => p.action === "present")?.length
    }, [precense])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (draft?.length === 0) return
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
                <div className="relative card max-w-[320px] bg-gray-100 px-1 shadow-2xl ml-20 mr-4">
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
        <div className="inline-flex card py-2 px-2 gap-3 items-center">
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
                                availableRooms?.map(({ icon, title }: IRoom) => <button onClick={() => setCurChannel(title)} key={title} type="button" className="card shadow-2xl rounded-2xl inline-flex itemx-center justify-center button relative w-[56px] h-[56px] text-gray-500 bg-white border border-gray-200 hover:text-gray-900 dark:border-gray-600  dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                                    <div className={`${curChannel === title ? "animate-pulse" : ""} text-lg font-bold items-center justify-center`}>{icon}</div>
                                    <span className="absolute card shadow-2xl ring-1 ring-purple-600 text-purple-600 py-1 px-2 block mb-px text-sm font-medium -translate-y-1/2 -left-28 top-1/2">{ChannelNameMapper?.[title] ?? "Общий"}</span>
                                </button>)
                            }
                        </div>
                    </motion.div>}
                </AnimatePresence>
                <button onClick={() => void setIsOpen(!isOpen)} type="button" className="button rounded-2xl flex items-center justify-center text-white w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                    <div>
                        <svg viewBox="0 0 24 24" className="fill-white w-10 h-10 stoke-white">
                            <path d="M19.3259 5.77772L18.4944 6.33329V6.33329L19.3259 5.77772ZM19.3259 16.2223L18.4944 15.6667V15.6667L19.3259 16.2223ZM18.2223 17.3259L17.6667 16.4944H17.6667L18.2223 17.3259ZM14 17.9986L13.9956 16.9986C13.4451 17.001 13 17.4481 13 17.9986H14ZM14 18L14.8944 18.4472C14.9639 18.3084 15 18.1552 15 18H14ZM10 18H9C9 18.1552 9.03615 18.3084 9.10557 18.4472L10 18ZM10 17.9986H11C11 17.4481 10.5549 17.001 10.0044 16.9986L10 17.9986ZM5.77772 17.3259L6.33329 16.4944H6.33329L5.77772 17.3259ZM4.67412 16.2223L5.50559 15.6667L5.50559 15.6667L4.67412 16.2223ZM4.67412 5.77772L5.50559 6.33329L4.67412 5.77772ZM5.77772 4.67412L6.33329 5.50559L5.77772 4.67412ZM18.2223 4.67412L17.6667 5.50559L17.6667 5.50559L18.2223 4.67412ZM21 11C21 9.61635 21.0012 8.50334 20.9106 7.61264C20.8183 6.70523 20.6225 5.91829 20.1573 5.22215L18.4944 6.33329C18.7034 6.64604 18.8446 7.06578 18.9209 7.81505C18.9988 8.58104 19 9.57473 19 11H21ZM20.1573 16.7779C20.6225 16.0817 20.8183 15.2948 20.9106 14.3874C21.0012 13.4967 21 12.3836 21 11H19C19 12.4253 18.9988 13.419 18.9209 14.1849C18.8446 14.9342 18.7034 15.354 18.4944 15.6667L20.1573 16.7779ZM18.7779 18.1573C19.3238 17.7926 19.7926 17.3238 20.1573 16.7779L18.4944 15.6667C18.2755 15.9943 17.9943 16.2755 17.6667 16.4944L18.7779 18.1573ZM14.0044 18.9986C15.0785 18.9939 15.9763 18.9739 16.7267 18.8701C17.4931 18.7642 18.1699 18.5636 18.7779 18.1573L17.6667 16.4944C17.3934 16.6771 17.0378 16.8081 16.4528 16.889C15.8518 16.9721 15.0792 16.9939 13.9956 16.9986L14.0044 18.9986ZM15 18V17.9986H13V18H15ZM13.7889 20.6584L14.8944 18.4472L13.1056 17.5528L12 19.7639L13.7889 20.6584ZM10.2111 20.6584C10.9482 22.1325 13.0518 22.1325 13.7889 20.6584L12 19.7639L12 19.7639L10.2111 20.6584ZM9.10557 18.4472L10.2111 20.6584L12 19.7639L10.8944 17.5528L9.10557 18.4472ZM9 17.9986V18H11V17.9986H9ZM5.22215 18.1573C5.83014 18.5636 6.50685 18.7642 7.2733 18.8701C8.02368 18.9739 8.92154 18.9939 9.99564 18.9986L10.0044 16.9986C8.92075 16.9939 8.14815 16.9721 7.54716 16.889C6.96223 16.8081 6.60665 16.6771 6.33329 16.4944L5.22215 18.1573ZM3.84265 16.7779C4.20744 17.3238 4.6762 17.7926 5.22215 18.1573L6.33329 16.4944C6.00572 16.2755 5.72447 15.9943 5.50559 15.6667L3.84265 16.7779ZM3 11C3 12.3836 2.99879 13.4967 3.0894 14.3874C3.18171 15.2948 3.3775 16.0817 3.84265 16.7779L5.50559 15.6667C5.29662 15.354 5.15535 14.9342 5.07913 14.1849C5.00121 13.419 5 12.4253 5 11H3ZM3.84265 5.22215C3.3775 5.91829 3.18171 6.70523 3.0894 7.61264C2.99879 8.50334 3 9.61635 3 11H5C5 9.57473 5.00121 8.58104 5.07913 7.81505C5.15535 7.06578 5.29662 6.64604 5.50559 6.33329L3.84265 5.22215ZM5.22215 3.84265C4.6762 4.20744 4.20744 4.6762 3.84265 5.22215L5.50559 6.33329C5.72447 6.00572 6.00572 5.72447 6.33329 5.50559L5.22215 3.84265ZM11 3C9.61635 3 8.50334 2.99879 7.61264 3.0894C6.70523 3.18171 5.91829 3.3775 5.22215 3.84265L6.33329 5.50559C6.64604 5.29662 7.06578 5.15535 7.81505 5.07913C8.58104 5.00121 9.57473 5 11 5V3ZM13 3H11V5H13V3ZM18.7779 3.84265C18.0817 3.3775 17.2948 3.18171 16.3874 3.0894C15.4967 2.99879 14.3836 3 13 3V5C14.4253 5 15.419 5.00121 16.1849 5.07913C16.9342 5.15535 17.354 5.29662 17.6667 5.50559L18.7779 3.84265ZM20.1573 5.22215C19.7926 4.6762 19.3238 4.20744 18.7779 3.84265L17.6667 5.50559C17.9943 5.72447 18.2755 6.00572 18.4944 6.33329L20.1573 5.22215Z" fill="white" />
                            <circle cx="16" cy="11" r="1" fill="white" stroke="white" stroke-linecap="round" />
                            <circle cx="12" cy="11" r="1" fill="white" stroke="white" stroke-linecap="round" />
                            <circle cx="8" cy="11" r="1" fill="white" stroke="white" stroke-linecap="round" />
                        </svg>
                    </div>
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
                    <Icons.Check />
                    <Icons.Check />
                </div>
            </div>
            <div className="inline-flex items-center justify-between">
                <div className="inline-flex items-center px-1 gap-2">
                    <button onClick={() => !mine && onReact(true)} className="group flex items-center">
                        <Icons.Happy className="w-4 h-4 fill-green-200 group-hover:animate-bounce group-hover:cursor-pointer" />
                        <Badge color="green" className="group-hover:opacity-80">{reactions?.[0] ?? 0}</Badge>
                    </button>
                    <button onClick={() => !mine && onReact(false)} className='group flex items-center'>
                        <Icons.Sad className="w-4 h-4 fill-red-400 group-hover:animate-bounce group-hover:cursor-pointer" />
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








export default Chat;
