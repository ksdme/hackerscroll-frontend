import { useRef } from 'react'

/*
  Non reactive value storeage with handy accessors.
*/
export default function useObjectStore<V>() {
  const store = useRef({} as {
    [key: string | number]: V
  })

  // Accessors.
  return {
    get: (key: string | number) => store.current[key],
    set: (key: string | number, value: V) => store.current[key] = value,
  }
}
