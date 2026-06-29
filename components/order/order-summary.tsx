import { formatMVR } from '@/lib/format'
import { priceOrder } from '@/lib/orders/pricing'
import type { OrderType, RestaurantSettings } from '@/lib/orders/types'

type Line = { id: string; name: string; price_mvr: number; quantity: number; notes?: string }

export function OrderSummary({
  items,
  orderType,
  settings,
  showItems = true,
}: {
  items: Line[]
  orderType: OrderType
  settings: RestaurantSettings
  showItems?: boolean
}) {
  const { subtotal, service_charge, delivery_fee, tax, total } = priceOrder(
    items,
    orderType,
    settings,
  )

  return (
    <div className="flex flex-col gap-3">
      {showItems && (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
              <span className="min-w-0">
                <span className="font-medium">{item.quantity}× </span>
                {item.name}
                {item.notes ? (
                  <span className="block text-xs text-muted-foreground">Note: {item.notes}</span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatMVR(item.price_mvr * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="flex flex-col gap-1.5 border-t border-dashed border-border pt-3 text-sm">
        <Row label="Subtotal" value={formatMVR(subtotal)} />
        {service_charge > 0 && (
          <Row
            label={`Service charge (${settings.service_charge_percent}%)`}
            value={formatMVR(service_charge)}
          />
        )}
        {orderType === 'delivery' && (
          <Row label="Delivery fee" value={formatMVR(delivery_fee)} />
        )}
        {tax > 0 && <Row label={`Tax (${settings.tax_percent}%)`} value={formatMVR(tax)} />}
        <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
          <dt className="font-heading text-base font-semibold">Total</dt>
          <dd className="font-heading text-lg font-semibold text-primary tabular-nums">
            {formatMVR(total)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
