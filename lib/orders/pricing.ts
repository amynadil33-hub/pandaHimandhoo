import type { OrderType, RestaurantSettings } from './types'

export type PricedLine = {
  price_mvr: number
  quantity: number
}

export function priceOrder(
  items: PricedLine[],
  orderType: OrderType,
  settings: Pick<
    RestaurantSettings,
    'service_charge_percent' | 'tax_percent' | 'delivery_fee_mvr'
  >,
) {
  const subtotal = items.reduce((sum, i) => sum + i.price_mvr * i.quantity, 0)
  const service_charge = Math.round(subtotal * (settings.service_charge_percent / 100))
  const delivery_fee = orderType === 'delivery' ? settings.delivery_fee_mvr : 0
  const tax = Math.round((subtotal + service_charge) * (settings.tax_percent / 100))
  const total = subtotal + service_charge + delivery_fee + tax
  return { subtotal, service_charge, delivery_fee, tax, total }
}
