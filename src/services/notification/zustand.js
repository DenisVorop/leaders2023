import { createPortal } from "react-dom"
import { createContext, useEffect, useMemo, useReducer, useCallback, useContext, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand"
import { shallow } from "zustand/shallow"

const useNotificationStore = create((set, get) => ({
  notifications: [],
  add: (toast) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: +new Date(),
          content: toast.content,
          type: toast.type,
          delay: toast.delay
        }
      ]
    }))
  },
  remove: (toast) => {

    set((state) => ({ notifications: state.notifications.filter(elem => elem.id !== toast.id) }))
  },
  clear: () => set({ notifications: [] })
}))

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
      className="flex h-fit order-1 lg:order-2 p-2 sm:p-4"
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
  const { remove, notifications } = useNotificationStore(
    ({ remove, notifications }) => ({ remove, notifications }),
    shallow
  )

  useEffect(() => {
    ref.current = document.body
  }, [])


  const animationConfig = useMemo(() => ({
    layout: true,
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.5 }
  }), [])

  return <>
    {children}
    {ref.current && createPortal(
      <ul className="fixed flex-col py-2 absolute left-0 bottom-0 z-100">
        {notifications.map((toast) => <li key={toast.id}>
          <AnimatePresence>
            <motion.div
              key={toast.id}
              {...animationConfig}
            >
              <ToastComponent toast={toast} onClose={() => remove(toast)} />
            </motion.div>
          </AnimatePresence>
        </li>)
        }
      </ul>
      , ref.current)}
  </>
}

export const useNotify = (init) => {
  return useNotificationStore(
    ({ add, notifications }) => {
      return [
        (params) => add({ delay: init?.delay || 3000, ...params }), notifications
      ]
    },
    shallow
  )
}
