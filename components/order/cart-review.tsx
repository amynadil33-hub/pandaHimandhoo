'use client'

import { useState } from 'react'
import { MessageSquarePlus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatMVR } from '@/lib/format'
import { QuantityControl } from './quantity-control'

export function CartReview() {
  const { items, increment, decrement, remove, setNotes } = useCart()
  const [openNote, setOpenNote] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        Your cart is empty. Add some dishes to get started.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const noteOpen = openNote === item.id || item.notes.length > 0
        return (
          <li key={item.id} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{item.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {formatMVR(item.price_mvr)} each
                </p>
              </div>
              <p className="shrink-0 font-heading font-semibold text-primary tabular-nums">
                {formatMVR(item.price_mvr * item.quantity)}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <QuantityControl
                value={item.quantity}
                onIncrement={() => increment(item.id)}
                onDecrement={() => decrement(item.id)}
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpenNote(noteOpen ? null : item.id)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <MessageSquarePlus className="size-4" />
                  Note
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.id)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {noteOpen && (
              <input
                value={item.notes}
                onChange={(e) => setNotes(item.id, e.target.value)}
                placeholder="e.g. less spicy, no onion, extra sauce"
                className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
