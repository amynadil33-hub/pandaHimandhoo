'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function QuantityControl({
  value,
  onIncrement,
  onDecrement,
  size = 'default',
  className,
}: {
  value: number
  onIncrement: () => void
  onDecrement: () => void
  size?: 'default' | 'lg'
  className?: string
}) {
  const btn =
    size === 'lg'
      ? 'size-10 [&_svg]:size-5'
      : 'size-8 [&_svg]:size-4'
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-background p-1',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrement}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:translate-y-px',
          btn,
        )}
      >
        <Minus />
      </button>
      <span
        className={cn(
          'min-w-6 text-center font-semibold tabular-nums',
          size === 'lg' ? 'text-base' : 'text-sm',
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px',
          btn,
        )}
      >
        <Plus />
      </button>
    </div>
  )
}
