import { cn } from '@/lib/utils'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/orders/types'

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        ORDER_STATUS_STYLES[status],
        className,
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  )
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        PAYMENT_STATUS_STYLES[status],
        className,
      )}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  )
}
