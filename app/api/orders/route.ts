import { NextResponse } from 'next/server'
import { createOrder, listOrders, type NewOrderInput } from '@/lib/orders/store'
import { isAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Admin-only full order list.
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const orders = await listOrders()
  return NextResponse.json({ orders })
}

export async function POST(req: Request) {
  let body: NewOrderInput
  try {
    body = (await req.json()) as NewOrderInput
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
  }
  if (!body.order_type || !body.payment_method) {
    return NextResponse.json({ error: 'Missing order type or payment method.' }, { status: 400 })
  }

  try {
    const order = await createOrder(body)
    return NextResponse.json({ order })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not place order'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
