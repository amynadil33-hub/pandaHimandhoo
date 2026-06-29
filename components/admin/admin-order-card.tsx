"use client"

import { useState } from "react"
import {
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  X,
  Receipt,
  ExternalLink,
  Loader2,
} from "lucide-react"
import {
  type Order,
  type OrderStatus,
  ORDER_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  NEXT_STATUS_FOR_TYPE,
} from "@/lib/orders/types"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/order/status-badges"
import { formatMvr, formatTime } from "@/lib/format"

function nextStatus(order: Order): OrderStatus | null {
  const flow = NEXT_STATUS_FOR_TYPE[order.order_type]
  const idx = flow.indexOf(order.status)
  if (idx < 0 || idx >= flow.length - 1) return null
  return flow[idx + 1]
}

export function AdminOrderCard({
  order,
  onChanged,
}: {
  order: Order
  onChanged: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function patch(body: Record<string, unknown>) {
    setBusy(true)
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  const upcoming = nextStatus(order)
  const awaitingPayment = order.payment_status === "pending_review"
  const isClosed = order.status === "completed" || order.status === "cancelled"

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">#{order.order_number}</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {ORDER_TYPE_LABELS[order.order_type]}
              {order.table_number ? ` · T${order.table_number}` : ""}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formatTime(order.created_at)}
            {order.estimated_ready_time ? ` · ETA ${order.estimated_ready_time}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      {/* Customer info */}
      {(order.customer_name || order.customer_phone || order.delivery_address) && (
        <div className="mt-3 space-y-1 text-sm">
          {order.customer_name ? <p className="font-medium">{order.customer_name}</p> : null}
          {order.customer_phone ? (
            <a
              href={`tel:${order.customer_phone}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Phone className="size-3.5" />
              {order.customer_phone}
            </a>
          ) : null}
          {order.delivery_address ? (
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>
                {order.delivery_address}
                {order.delivery_landmark ? ` (${order.delivery_landmark})` : ""}
              </span>
            </p>
          ) : null}
        </div>
      )}

      {/* Items */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-left text-sm"
      >
        <span className="font-medium">
          {order.items.reduce((n, i) => n + i.quantity, 0)} item(s) · {formatMvr(order.total_mvr)}
        </span>
        <ChevronRight className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>
      {expanded ? (
        <ul className="mt-2 space-y-1.5 px-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2">
              <span>
                <span className="text-muted-foreground">{item.quantity}×</span> {item.item_name}
                {item.item_notes ? (
                  <span className="block text-xs text-muted-foreground">{item.item_notes}</span>
                ) : null}
              </span>
              <span className="shrink-0">{formatMvr(item.line_total_mvr)}</span>
            </li>
          ))}
          <li className="flex justify-between border-t border-border pt-1.5 font-semibold">
            <span>Total ({PAYMENT_METHOD_LABELS[order.payment_method ?? "online"]})</span>
            <span>{formatMvr(order.total_mvr)}</span>
          </li>
        </ul>
      ) : null}

      {order.notes ? (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Note: {order.notes}</p>
      ) : null}

      {/* Slip review */}
      {order.slip_image_url ? (
        <a
          href={order.slip_image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <Receipt className="size-4" />
          View payment slip
          <ExternalLink className="size-3" />
        </a>
      ) : null}

      {/* Actions */}
      {!isClosed ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {awaitingPayment ? (
            <button
              onClick={() => patch({ payment_status: "paid", status: "confirmed" })}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Verify payment
            </button>
          ) : null}
          {upcoming ? (
            <button
              onClick={() => patch({ status: upcoming })}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
              Mark {ORDER_STATUS_LABELS[upcoming]}
            </button>
          ) : null}
          <button
            onClick={() => patch({ status: "cancelled" })}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
          >
            <X className="size-4" />
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  )
}
