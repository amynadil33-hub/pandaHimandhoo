import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UtensilsCrossed } from 'lucide-react'
import { getMenu } from '@/lib/menu'
import { getSettings, getTableBySlug } from '@/lib/orders/store'
import { OrderClient } from '@/components/order/order-client'

export const metadata: Metadata = {
  title: 'Order at your table | Panda Restaurant',
  description: 'Scan, browse the menu and order directly from your table.',
}

export const dynamic = 'force-dynamic'

export default async function TableOrderPage({
  params,
}: {
  params: Promise<{ tableSlug: string }>
}) {
  const { tableSlug } = await params
  const table = await getTableBySlug(tableSlug)
  if (!table) notFound()

  const [{ categories }, settings] = await Promise.all([getMenu(), getSettings()])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground">
          {table.table_number}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <UtensilsCrossed className="size-3.5" />
            Dine-in
          </p>
          <h1 className="font-heading text-xl font-semibold">Table {table.table_number}</h1>
          <p className="text-sm text-muted-foreground">
            Browse the menu and order without leaving your seat.
          </p>
        </div>
      </div>

      <OrderClient
        categories={categories}
        settings={settings}
        orderType="dine_in"
        table={{ id: table.id, table_number: table.table_number }}
      />
    </div>
  )
}
