import { useRef } from 'react'

/*
  Non reactive value storeage with handy accessors.
*/
export default function useObjectStore<K extends string | number, V>() {
  const store = useRef({} as Record<K, V>)

  // Accessors.
  return {
    get: (key: string | number) => store.current[key],
    set: (key: string | number, value: V) => store.current[key] = value,
    reset: () => store.current = {} as Record<K, V>,
  }
}
