'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  id: string
  name: string
  price_mvr: number
  quantity: number
  notes: string
}

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  add: (item: { id: string; name: string; price_mvr: number }) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  setNotes: (id: string, notes: string) => void
  remove: (id: string) => void
  clear: () => void
  hydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'panda_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price_mvr * i.quantity, 0)
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    return {
      items,
      count,
      subtotal,
      hydrated,
      add: (item) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.id === item.id)
          if (existing) {
            return prev.map((p) =>
              p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p,
            )
          }
          return [...prev, { ...item, quantity: 1, notes: '' }]
        }),
      increment: (id) =>
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)),
        ),
      decrement: (id) =>
        setItems((prev) =>
          prev
            .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
            .filter((p) => p.quantity > 0),
        ),
      setNotes: (id, notes) =>
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, notes } : p))),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
    }
  }, [items, hydrated])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
