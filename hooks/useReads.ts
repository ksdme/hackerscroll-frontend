import createPersistedState from 'use-persisted-state'

// Persistent data source for reads.
export const useReadsStore = createPersistedState('reads')

// Interact with the reads.
export default function useReads() {
  const [
    reads,
    setReads,
  ] = useReadsStore({})

  // Getter
  const get = (id: number) => {
    return Boolean(reads[id])
  }

  // Toggle
  const toggle = (id: number) => {
    setReads({
      ...reads,
      [id]: !get(id),
    })
  }

  return {
    get,
    toggle,
  }
}
