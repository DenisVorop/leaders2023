import { createPortal } from "react-dom"
import { createContext, useEffect, useMemo, useReducer, useCallback, useContext, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion";

const NotifierContext = createContext(null);

const NotifyAction = {
  ADD: "notify/add",
  REMOVE: "notify/remove",
  CLEAR: "notify/clear"
}

const initialState = []

const reducer = (state, action) => {
  switch (action.type) {
    case NotifyAction.ADD: {
      return [
        ...state,
        {
          id: +new Date(),
          content: action.payload.content,
          type: action.payload.type,
          delay: action.payload.delay
        },
      ]
    }
    case NotifyAction.REMOVE: {
      return state.filter(elem => elem.id !== action.payload.id)
    }
    case NotifyAction.CLEAR: {
      return initialState
    }
  }
}



const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast.delay) {
      return
    }
    const timeoutId = setTimeout(onClose, toast.delay);
    return () => clearTimeout(timeoutId);
  }, []);

  const renderItem = useCallback((content) => {
    if (typeof content === "function") {
      return content(onClose);
    } else {
      return <pre>{JSON.stringify(content, null, 1)}</pre>;
    }
  }, [onClose])

  return (
    <div
      className="flex h-fit order-1 lg:order-2 border-[1px] border-blue rounded-[12px] shadow-main bg-gradient-to-b from-bg-from to-bg-to p-2 sm:p-4"
      role="alert"
    >
      <div className="flex">
        {renderItem(toast.content)}
      </div>
    </div>
  );
};



export const NotifyProvider = ({ ToastComponent = Toast, children }) => {
  const ref = useRef(null)
  const [list, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    ref.current = document.body
  }, [])

  const ctx = useMemo(() => {
    return {
      notifications: list,
      notify: (params) => dispatch({ type: NotifyAction.ADD, payload: params })
    }
  }, [list, dispatch])

  const animationConfig = useMemo(() => ({
    layout: true,
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.5 }
  }), [])


  return <NotifierContext.Provider value={ctx}>
    {children}
    {ref.current && createPortal(
      <ul className="fixed flex-col py-2 absolute left-0 bottom-0 z-100">
        {list.map((toast) => <li key={toast.id}>
          <AnimatePresence>
            <motion.div
              key={toast.id}
              {...animationConfig}
            >
              <ToastComponent toast={toast} onClose={() => dispatch({ type: NotifyAction.REMOVE, payload: toast })} />
            </motion.div>
          </AnimatePresence>
        </li>)
        }
      </ul>
      , ref.current)}
  </NotifierContext.Provider>
}

export const useNotify = (params) => {
  const { notify, notifications } = useContext(NotifierContext)

  const injectedNotify = useCallback((params) => {
    return notify({ delay: params?.delay || 3000, ...params })
  }, [params, notify])

  return [injectedNotify, notifications]
}

