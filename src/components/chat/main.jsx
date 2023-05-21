import { useChannel } from '@ably-labs/react-hooks'

import { useState, useEffect, useMemo } from 'react'
import { useMeQuery } from '../../services/auth/api'


const defaultUser = 'Anonymous'

const Chat = ({ channelName = "default" }) => {
  const [messages, setMessages] = useState([])

  const [channel, ably] = useChannel(channelName, (message) => {
    setMessages((state => [...state, message]))
  })
  const { author } = useMeQuery(undefined, {
    selectFromResult: ({ data }) => {
      return { author: data?.email ?? defaultUser }
    }
  })

  useEffect(() => {
    channel.history((err, result) => {
      setMessages(state => [...(result?.items ?? []), ...state])
    })
  }, [channel])

  const [draft, setDraft] = useState("")

  const onChangeDraft = (e) => {
    setDraft(e?.target?.value)
  }

  const sendMessage = () => {
    if (draft.length === 0) return
    channel.publish('send', {
      message: { author, content: draft, timestamp: new Date() },
    })
    setDraft('')
  }

  const chatMessages = useMemo(() => messages.map((msg) => ({ ...msg, other: author !== msg?.data?.message?.author })), [messages, author])


  return <div className="flex-1 p:2 sm:p-6 max-w-2xl justify-between flex flex-col h-screen">
    <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
      <div className="relative flex items-center space-x-4">
        <div className="flex flex-col leading-tight">
          <div className="text-2xl mt-1 flex items-center">
            <div className="relative  px-2 animation-pulse">
              <span className="text-green-500">
                <svg width="20" height="20" className='animate-pulse'>
                  <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                </svg>
              </span>
            </div>
            <span className="text-gray-700 mr-3">{author}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button type="button" className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
      </div>
    </div>
    <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {
        chatMessages.map(msg => <Message other={msg?.other} key={msg?.data?.timestamp} msg={msg} />)
      }
    </div>

    <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex">
        <span className="absolute inset-y-0 flex items-center">
          <button type="button" className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
            </svg>
          </button>
        </span>
        <input type="text" value={draft} onChange={onChangeDraft} placeholder="Напишите сообщение" className="input w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3" />
        <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
          <button onClick={sendMessage} type="button" className="button inline-flex">
            <span className="font-bold">Отправить</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 ml-2 transform rotate-90">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
}


const Message = ({ msg, other }) => {
  console.log(msg)
  return <div className="chat-message">
    <div className={`flex items-end ${other || "justify-end"}`}>
      <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
        <div><span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">{msg?.data?.message?.content}</span></div>
      </div>
      <span alt="profile" className="w-6 h-6 rounded-full order-1">{msg?.data?.message?.author?.[0]}</span>
    </div>
  </div>
}

export default Chat;
