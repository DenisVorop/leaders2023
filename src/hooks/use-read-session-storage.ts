import { useCallback, useEffect, useState } from 'react'
import { useEventListener } from './use-event-listener'

type Value<T> = T | null

function useReadSessionStorage<T>(key: string): Value<T> {
    const readValue = useCallback((): Value<T> => {
        if (typeof window === 'undefined') {
            return null
        }

        try {
            const item = window.sessionStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : null
        } catch (error) {
            console.warn(`Error reading sessionStorage key “${key}”:`, error)
            return null
        }
    }, [key])

    const [storedValue, setStoredValue] = useState<Value<T>>(readValue)

    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleStorageChange = useCallback(
        (event: StorageEvent | CustomEvent) => {
            if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
                return
            }
            setStoredValue(readValue())
        },
        [key, readValue],
    )


    useEventListener('storage', handleStorageChange)

    useEventListener('session-storage', handleStorageChange)

    return storedValue
}

export default useReadSessionStorage
