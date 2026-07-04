import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrderTracker } from "@/components/order/order-tracker"
import { formatMVR } from "@/lib/format"
import { getOrder } from "@/lib/orders/store"
import {
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/orders/types"

export const dynamic = "force-dynamic"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-MV", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const order = await getOrder(orderId)

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/order"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to ordering
      </Link>

      {!order ? (
        <section className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">Order confirmation</h1>
          <p className="mt-3 text-muted-foreground">
            Order not found or still loading. Please contact Panda Restaurant if this continues.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Thank you. Your order has been received.
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>
            <p className="mt-1 text-muted-foreground">
              {ORDER_TYPE_LABELS[order.order_type]} · {ORDER_STATUS_LABELS[order.status]}
            </p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <Detail label="Order number" value={`#${order.order_number}`} />
            <Detail label="Order type" value={ORDER_TYPE_LABELS[order.order_type]} />
            <Detail label="Table number" value={order.order_type === "dine_in" ? order.table_number : null} />
            <Detail label="Customer name" value={order.customer_name || "Guest"} />
            <Detail label="Customer phone" value={order.customer_phone || "Not provided"} />
            <Detail label="Delivery address" value={order.order_type === "delivery" ? order.delivery_address : null} />
            <Detail label="Pickup time" value={order.order_type === "takeaway" ? order.pickup_time || "ASAP" : null} />
            <Detail label="Payment method" value={order.payment_method ? PAYMENT_METHOD_LABELS[order.payment_method] : "Not provided"} />
            <Detail label="Payment status" value={PAYMENT_STATUS_LABELS[order.payment_status]} />
            <Detail label="Order status" value={ORDER_STATUS_LABELS[order.status]} />
            <Detail label="Created time" value={formatDate(order.created_at)} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Ordered items</h2>
            <div className="mt-4 divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="font-semibold tabular-nums">{item.quantity}x</span>
                  <div className="flex-1">
                    <p className="font-medium">{item.item_name}</p>
                    {item.item_notes ? <p className="mt-1 text-sm text-muted-foreground">{item.item_notes}</p> : null}
                  </div>
                  <span className="font-medium tabular-nums">{formatMVR(item.line_total_mvr)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatMVR(order.subtotal_mvr)}</dd></div>
              {order.delivery_fee_mvr > 0 ? <div className="flex justify-between"><dt>Delivery fee</dt><dd>{formatMVR(order.delivery_fee_mvr)}</dd></div> : null}
              <div className="flex justify-between text-base font-bold"><dt>Total MVR</dt><dd>{formatMVR(order.total_mvr)}</dd></div>
            </dl>
          </section>

          <OrderTracker orderId={order.id} initialOrder={order} />
        </div>
      )}
    </main>
  )
}
