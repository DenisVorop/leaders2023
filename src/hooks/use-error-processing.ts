'use client'

import { useNotify } from '@/services/notification/zustand'
import { useEffect } from 'react'

type Type = 'success' | 'danger'

const generateMsgFromType = (type: Type) => {
    switch (type) {
        case 'success':
            return 'Успешно!'
        case 'danger':
            return 'Произошла непредвиденная ошибка'
    }
}

export const useErrorProcessing = (bool: boolean, type: Type, msg?: string, fn?: () => void) => {
    const [notify] = useNotify()

    useEffect(() => {
        if (bool) {
            notify({
                type,
                content: () => msg || generateMsgFromType(type),
            })

            if (!fn) {
                return
            }

            fn()

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bool])
}
