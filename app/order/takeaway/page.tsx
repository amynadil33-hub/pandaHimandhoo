import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'
import { getMenu } from '@/lib/menu'
import { getSettings } from '@/lib/orders/store'
import { OrderClient } from '@/components/order/order-client'

export const metadata: Metadata = {
  title: 'Takeaway Order | Panda Restaurant',
  description: 'Order Panda Restaurant favourites for pickup on Himandhoo Island.',
}

export const dynamic = 'force-dynamic'

export default async function TakeawayOrderPage() {
  const [{ categories }, settings] = await Promise.all([getMenu(), getSettings()])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-accent/10 p-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <ShoppingBag className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-semibold">Takeaway order</h1>
          <p className="text-sm text-muted-foreground">
            Order ahead and collect at the counter · Est. {settings.estimated_prep_time}
          </p>
        </div>
      </div>

      <OrderClient categories={categories} settings={settings} orderType="takeaway" />
    </div>
  )
}
