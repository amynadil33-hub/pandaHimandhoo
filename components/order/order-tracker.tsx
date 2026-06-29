"use client"

import useSWR from "swr"
import { CheckCircle2, Clock, ChefHat, Package, Bike, UtensilsCrossed, Loader2 } from "lucide-react"
import {
  type Order,
  type OrderStatus,
  ORDER_TYPE_LABELS,
  NEXT_STATUS_FOR_TYPE,
} from "@/lib/orders/types"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/status-badges"
import { formatMvr, formatDateTime } from "@/lib/format"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const STEP_ICONS: Record<string, typeof Clock> = {
  new: Clock,
  confirmed: CheckCircle2,
  preparing: ChefHat,
  ready: Package,
  out_for_delivery: Bike,
  served: UtensilsCrossed,
  completed: CheckCircle2,
}

const STEP_LABELS: Record<OrderStatus, string> = {
  payment_pending: "Awaiting payment",
  new: "Order received",
  confirmed: "Confirmed",
  preparing: "Preparing your food",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
}

export function OrderTracker({ orderId, initialOrder }: { orderId: string; initialOrder: Order }) {
  const { data } = useSWR<{ order: Order }>(`/api/orders/${orderId}`, fetcher, {
    refreshInterval: 8000,
    fallbackData: { order: initialOrder },
  })
  const order = data?.order ?? initialOrder

  const steps = NEXT_STATUS_FOR_TYPE[order.order_type]
  const currentIndex = steps.indexOf(order.status)
  const isCancelled = order.status === "cancelled"

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Order</p>
            <p className="text-2xl font-bold">#{order.order_number}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {ORDER_TYPE_LABELS[order.order_type]}
              {order.table_number ? ` · Table ${order.table_number}` : ""} · {formatDateTime(order.created_at)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.payment_status} />
          </div>
        </div>

        {order.estimated_ready_time && !isCancelled && order.status !== "completed" ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            <Clock className="size-4" />
            <span>Estimated ready around {formatDateTime(order.estimated_ready_time)}</span>
          </div>
        ) : null}
      </div>

      {/* Progress tracker */}
      {!isCancelled ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Progress</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[step] ?? Clock
              const done = i < currentIndex
              const active = i === currentIndex
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={[
                      "flex size-9 shrink-0 items-center justify-center rounded-full border",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {active ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                  </span>
                  <span
                    className={[
                      "text-sm",
                      done || active ? "font-medium text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {STEP_LABELS[step]}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      ) : (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <p className="font-semibold">This order was cancelled.</p>
          <p className="mt-1 text-sm">Please contact the restaurant if you have any questions.</p>
        </div>
      )}

      {/* Items */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Items</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="font-medium">
                  <span className="text-muted-foreground">{item.quantity}×</span> {item.item_name}
                </p>
                {item.item_notes ? <p className="text-sm text-muted-foreground">{item.item_notes}</p> : null}
              </div>
              <span className="shrink-0 font-medium">{formatMvr(item.line_total_mvr)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd>{formatMvr(order.subtotal_mvr)}</dd>
          </div>
          {order.service_charge_mvr > 0 ? (
            <div className="flex justify-between text-muted-foreground">
              <dt>Service charge</dt>
              <dd>{formatMvr(order.service_charge_mvr)}</dd>
            </div>
          ) : null}
          {order.delivery_fee_mvr > 0 ? (
            <div className="flex justify-between text-muted-foreground">
              <dt>Delivery fee</dt>
              <dd>{formatMvr(order.delivery_fee_mvr)}</dd>
            </div>
          ) : null}
          {order.tax_mvr > 0 ? (
            <div className="flex justify-between text-muted-foreground">
              <dt>Tax (GST)</dt>
              <dd>{formatMvr(order.tax_mvr)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatMvr(order.total_mvr)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
