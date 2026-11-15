const locks = new WeakMap<Document, { count: number; overflow: string }>()

/** Shared by native modal surfaces so closing a nested modal keeps its parent locked. */
export function lockBodyScroll(document: Document): () => void {
  let state = locks.get(document)
  if (!state) {
    state = { count: 0, overflow: document.body.style.overflow }
    locks.set(document, state)
    document.body.style.overflow = 'hidden'
  }
  state.count++
  let released = false
  return () => {
    if (released) return
    released = true
    if (--state.count === 0) {
      document.body.style.overflow = state.overflow
      locks.delete(document)
    }
  }
}
