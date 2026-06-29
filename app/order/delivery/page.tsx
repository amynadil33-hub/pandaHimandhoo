import type { Metadata } from 'next'
import { Bike } from 'lucide-react'
import { getMenu } from '@/lib/menu'
import { getSettings } from '@/lib/orders/store'
import { OrderClient } from '@/components/order/order-client'
import { formatMVR } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Delivery Order | Panda Restaurant',
  description: 'Order Panda Restaurant food for delivery across Himandhoo Island.',
}

export const dynamic = 'force-dynamic'

export default async function DeliveryOrderPage() {
  const [{ categories }, settings] = await Promise.all([getMenu(), getSettings()])

  if (!settings.delivery_enabled) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold">Delivery is currently closed</h1>
        <p className="mt-2 text-muted-foreground">
          Please try takeaway or dine-in, or check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-primary/10 p-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bike className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-semibold">Island delivery</h1>
          <p className="text-sm text-muted-foreground">
            {settings.delivery_area_note} Fee {formatMVR(settings.delivery_fee_mvr)} · Min{' '}
            {formatMVR(settings.minimum_order_mvr)}
          </p>
        </div>
      </div>

      <OrderClient categories={categories} settings={settings} orderType="delivery" />
    </div>
  )
}
