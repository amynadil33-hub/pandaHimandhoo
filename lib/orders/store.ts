import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { priceOrder } from './pricing'
import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  RestaurantSettings,
  RestaurantTable,
} from './types'

export { priceOrder }

// ---------------------------------------------------------------------------
// Supabase admin client (server only). Falls back to null when env is missing,
// in which case the app uses an in-memory store so the preview still works.
// ---------------------------------------------------------------------------
function getAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  )
}

// ---------------------------------------------------------------------------
// Default settings + in-memory store seed
// ---------------------------------------------------------------------------
export const DEFAULT_SETTINGS: RestaurantSettings = {
  id: 'default',
  bank_name: 'Bank of Maldives',
  bank_account_name: 'Panda Restaurant Pvt Ltd',
  bank_account_number: '7730000123456',
  payment_instructions:
    'Transfer the total amount and upload your payment slip. Your order is confirmed once we verify the payment.',
  cash_enabled: true,
  bank_transfer_enabled: true,
  online_payment_enabled: false,
  delivery_enabled: true,
  takeaway_enabled: true,
  dine_in_enabled: true,
  service_charge_percent: 10,
  tax_percent: 8,
  delivery_fee_mvr: 30,
  minimum_order_mvr: 75,
  delivery_area_note: 'We deliver across Himandhoo Island only.',
  estimated_prep_time: '20–30 min',
  estimated_delivery_time: '30–45 min',
}

type MemStore = {
  orders: Order[]
  tables: RestaurantTable[]
  settings: RestaurantSettings
  counter: number
}

function seedTables(): RestaurantTable[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `table-${i + 1}`,
    table_number: String(i + 1),
    qr_slug: `table-${i + 1}`,
    is_active: true,
    created_at: new Date().toISOString(),
  }))
}

// Persist across HMR reloads in dev.
const g = globalThis as unknown as { __pandaStore?: MemStore }
function mem(): MemStore {
  if (!g.__pandaStore) {
    g.__pandaStore = {
      orders: [],
      tables: seedTables(),
      settings: DEFAULT_SETTINGS,
      counter: 1000,
    }
  }
  return g.__pandaStore
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------
export type NewOrderItem = {
  menu_item_id: string | null
  item_name: string
  item_price_mvr: number
  quantity: number
  item_notes?: string | null
}

export type NewOrderInput = {
  order_type: Order['order_type']
  table_id?: string | null
  table_number?: string | null
  customer_name?: string | null
  customer_phone?: string | null
  delivery_address?: string | null
  delivery_landmark?: string | null
  delivery_notes?: string | null
  pickup_time?: string | null
  payment_method: PaymentMethod
  notes?: string | null
  slip_image_url?: string | null
  source?: string
  items: NewOrderItem[]
}

function initialStatuses(
  method: PaymentMethod,
  orderType: Order['order_type'],
): { status: OrderStatus; payment_status: PaymentStatus } {
  switch (method) {
    case 'bank_transfer':
      return { status: 'payment_pending', payment_status: 'pending_review' }
    case 'online':
      return { status: 'payment_pending', payment_status: 'pending_review' }
    case 'cash_at_table':
      return { status: 'new', payment_status: 'pay_at_table' }
    case 'cash_on_delivery':
      return { status: 'new', payment_status: 'cash_on_delivery' }
    case 'pay_at_pickup':
      return { status: 'new', payment_status: 'pay_at_pickup' }
    default:
      return { status: 'new', payment_status: 'unpaid' }
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export async function getSettings(): Promise<RestaurantSettings> {
  const db = getAdminClient()
  if (!db) return mem().settings
  const { data, error } = await db.from('restaurant_settings').select('*').limit(1).maybeSingle()
  if (error || !data) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...data }
}

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------
export async function listTables(): Promise<RestaurantTable[]> {
  const db = getAdminClient()
  if (!db) return [...mem().tables].sort((a, b) => Number(a.table_number) - Number(b.table_number))
  const { data } = await db.from('restaurant_tables').select('*').order('table_number')
  return data ?? []
}

export async function getTableBySlug(slug: string): Promise<RestaurantTable | null> {
  const db = getAdminClient()
  if (!db) return mem().tables.find((t) => t.qr_slug === slug && t.is_active) ?? null
  const { data } = await db
    .from('restaurant_tables')
    .select('*')
    .eq('qr_slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return data ?? null
}

export async function createTable(input: {
  table_number: string
  qr_slug: string
}): Promise<RestaurantTable> {
  const db = getAdminClient()
  if (!db) {
    const table: RestaurantTable = {
      id: `table-${Date.now()}`,
      table_number: input.table_number,
      qr_slug: input.qr_slug,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    mem().tables.push(table)
    return table
  }
  const { data, error } = await db
    .from('restaurant_tables')
    .insert({ table_number: input.table_number, qr_slug: input.qr_slug, is_active: true })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateTable(
  id: string,
  patch: Partial<Pick<RestaurantTable, 'table_number' | 'qr_slug' | 'is_active'>>,
): Promise<void> {
  const db = getAdminClient()
  if (!db) {
    const t = mem().tables.find((x) => x.id === id)
    if (t) Object.assign(t, patch)
    return
  }
  await db.from('restaurant_tables').update(patch).eq('id', id)
}

export async function deleteTable(id: string): Promise<void> {
  const db = getAdminClient()
  if (!db) {
    g.__pandaStore!.tables = mem().tables.filter((t) => t.id !== id)
    return
  }
  await db.from('restaurant_tables').delete().eq('id', id)
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function listOrders(): Promise<Order[]> {
  const db = getAdminClient()
  if (!db) return [...mem().orders].sort((a, b) => b.order_number - a.order_number)
  const { data: orders } = await db
    .from('orders')
    .select('*')
    .order('order_number', { ascending: false })
  if (!orders) return []
  const { data: items } = await db.from('order_items').select('*')
  return orders.map((o) => ({
    ...o,
    items: (items ?? []).filter((i: OrderItem) => i.order_id === o.id),
  }))
}

export async function getOrder(id: string): Promise<Order | null> {
  const db = getAdminClient()
  if (!db) return mem().orders.find((o) => o.id === id) ?? null
  const { data: order } = await db.from('orders').select('*').eq('id', id).maybeSingle()
  if (!order) return null
  const { data: items } = await db.from('order_items').select('*').eq('order_id', id)
  return { ...order, items: items ?? [] }
}

export async function createOrder(input: NewOrderInput): Promise<Order> {
  const settings = await getSettings()
  const pricing = priceOrder(
    input.items.map((i) => ({ price_mvr: i.item_price_mvr, quantity: i.quantity })),
    input.order_type,
    settings,
  )
  const { status, payment_status } = initialStatuses(input.payment_method, input.order_type)
  const estimated =
    input.order_type === 'delivery' ? settings.estimated_delivery_time : settings.estimated_prep_time

  const db = getAdminClient()
  const now = new Date().toISOString()

  if (!db) {
    const store = mem()
    store.counter += 1
    const orderId = `order-${store.counter}`
    const items: OrderItem[] = input.items.map((it, idx) => ({
      id: `${orderId}-item-${idx}`,
      order_id: orderId,
      menu_item_id: it.menu_item_id,
      item_name: it.item_name,
      item_price_mvr: it.item_price_mvr,
      quantity: it.quantity,
      item_notes: it.item_notes ?? null,
      line_total_mvr: it.item_price_mvr * it.quantity,
    }))
    const order: Order = {
      id: orderId,
      order_number: store.counter,
      order_type: input.order_type,
      table_id: input.table_id ?? null,
      table_number: input.table_number ?? null,
      customer_name: input.customer_name ?? null,
      customer_phone: input.customer_phone ?? null,
      delivery_address: input.delivery_address ?? null,
      delivery_landmark: input.delivery_landmark ?? null,
      delivery_notes: input.delivery_notes ?? null,
      pickup_time: input.pickup_time ?? null,
      status,
      payment_status,
      payment_method: input.payment_method,
      subtotal_mvr: pricing.subtotal,
      service_charge_mvr: pricing.service_charge,
      delivery_fee_mvr: pricing.delivery_fee,
      tax_mvr: pricing.tax,
      total_mvr: pricing.total,
      notes: input.notes ?? null,
      source: input.source ?? 'website',
      estimated_ready_time: estimated,
      slip_image_url: input.slip_image_url ?? null,
      created_at: now,
      updated_at: now,
      items,
    }
    store.orders.unshift(order)
    return order
  }

  const { data: orderRow, error } = await db
    .from('orders')
    .insert({
      order_type: input.order_type,
      table_id: input.table_id ?? null,
      table_number: input.table_number ?? null,
      customer_name: input.customer_name ?? null,
      customer_phone: input.customer_phone ?? null,
      delivery_address: input.delivery_address ?? null,
      delivery_landmark: input.delivery_landmark ?? null,
      delivery_notes: input.delivery_notes ?? null,
      pickup_time: input.pickup_time ?? null,
      status,
      payment_status,
      payment_method: input.payment_method,
      subtotal_mvr: pricing.subtotal,
      service_charge_mvr: pricing.service_charge,
      delivery_fee_mvr: pricing.delivery_fee,
      tax_mvr: pricing.tax,
      total_mvr: pricing.total,
      notes: input.notes ?? null,
      source: input.source ?? 'website',
      estimated_ready_time: estimated,
      slip_image_url: input.slip_image_url ?? null,
    })
    .select('*')
    .single()
  if (error || !orderRow) throw new Error(error?.message ?? 'Failed to create order')

  const itemRows = input.items.map((it) => ({
    order_id: orderRow.id,
    menu_item_id: it.menu_item_id,
    item_name: it.item_name,
    item_price_mvr: it.item_price_mvr,
    quantity: it.quantity,
    item_notes: it.item_notes ?? null,
    line_total_mvr: it.item_price_mvr * it.quantity,
  }))
  const { data: items } = await db.from('order_items').insert(itemRows).select('*')
  return { ...orderRow, items: items ?? [] }
}

export async function updateOrder(
  id: string,
  patch: { status?: OrderStatus; payment_status?: PaymentStatus },
): Promise<Order | null> {
  const db = getAdminClient()
  if (!db) {
    const order = mem().orders.find((o) => o.id === id)
    if (!order) return null
    if (patch.status) order.status = patch.status
    if (patch.payment_status) order.payment_status = patch.payment_status
    order.updated_at = new Date().toISOString()
    return order
  }
  await db
    .from('orders')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
  return getOrder(id)
}
