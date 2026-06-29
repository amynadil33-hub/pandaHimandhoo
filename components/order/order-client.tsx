'use client'

import { CartProvider } from '@/lib/cart-context'
import type { MenuCategory } from '@/lib/menu'
import type { OrderType, RestaurantSettings } from '@/lib/orders/types'
import { OrderingExperience } from './ordering-experience'

export function OrderClient({
  categories,
  settings,
  orderType,
  table,
}: {
  categories: MenuCategory[]
  settings: RestaurantSettings
  orderType: OrderType
  table?: { id: string; table_number: string } | null
}) {
  return (
    <CartProvider>
      <OrderingExperience
        categories={categories}
        settings={settings}
        orderType={orderType}
        table={table}
      />
    </CartProvider>
  )
}
