'use client'

import { Banknote, Building2, CreditCard, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrderType, PaymentMethod, RestaurantSettings } from '@/lib/orders/types'

type Option = {
  method: PaymentMethod
  title: string
  description: string
  icon: typeof Banknote
}

function cashOptionFor(orderType: OrderType): Option {
  if (orderType === 'delivery') {
    return {
      method: 'cash_on_delivery',
      title: 'Cash on Delivery',
      description: 'Pay with cash when your order arrives.',
      icon: Banknote,
    }
  }
  if (orderType === 'takeaway') {
    return {
      method: 'pay_at_pickup',
      title: 'Pay at Pickup',
      description: 'Pay with cash when you collect your order.',
      icon: Banknote,
    }
  }
  return {
    method: 'cash_at_table',
    title: 'Pay at Table',
    description: 'Pay with cash at your table.',
    icon: Banknote,
  }
}

export function PaymentMethodSelector({
  orderType,
  settings,
  value,
  onChange,
}: {
  orderType: OrderType
  settings: RestaurantSettings
  value: PaymentMethod | null
  onChange: (method: PaymentMethod) => void
}) {
  const options: Option[] = []
  if (settings.cash_enabled) options.push(cashOptionFor(orderType))
  if (settings.bank_transfer_enabled)
    options.push({
      method: 'bank_transfer',
      title: 'Bank Transfer',
      description: 'Transfer and upload your payment slip for review.',
      icon: Building2,
    })
  if (settings.online_payment_enabled)
    options.push({
      method: 'online',
      title: 'Online Payment',
      description: 'Pay securely by card (coming soon).',
      icon: CreditCard,
    })

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-1 text-sm font-semibold">Payment method</legend>
      {options.map((opt) => {
        const selected = value === opt.method
        const Icon = opt.icon
        return (
          <button
            key={opt.method}
            type="button"
            onClick={() => onChange(opt.method)}
            aria-pressed={selected}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors',
              selected
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-border bg-card hover:bg-secondary',
            )}
          >
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground',
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{opt.title}</span>
              <span className="block text-sm text-muted-foreground">{opt.description}</span>
            </span>
            {selected && <Check className="size-5 shrink-0 text-primary" />}
          </button>
        )
      })}
    </fieldset>
  )
}
