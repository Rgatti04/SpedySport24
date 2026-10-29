import { createStore, useStore } from '@/lib/store'

export interface ToastMessage {
  id: number
  message: string
}

const toastStore = createStore<ToastMessage | null>(null)
let nextId = 1

/** Mostra un messaggio temporaneo da qualsiasi punto dell'app. */
export function showToast(message: string) {
  toastStore.set({ id: nextId++, message })
}

export function dismissToast() {
  toastStore.set(null)
}

export function useToast(): ToastMessage | null {
  return useStore(toastStore)
}
