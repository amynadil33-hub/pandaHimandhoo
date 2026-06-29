import { NextResponse } from 'next/server'
import { getOrder, updateOrder } from '@/lib/orders/store'
import { isAdmin } from '@/lib/admin-auth'
import type { OrderStatus, PaymentStatus } from '@/lib/orders/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = (await req.json()) as { status?: OrderStatus; payment_status?: PaymentStatus }
  const order = await updateOrder(id, body)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order })
}
