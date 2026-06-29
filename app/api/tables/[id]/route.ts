import { NextResponse } from 'next/server'
import { deleteTable, updateTable } from '@/lib/orders/store'
import { isAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = (await req.json()) as {
    table_number?: string
    qr_slug?: string
    is_active?: boolean
  }
  await updateTable(id, body)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  await deleteTable(id)
  return NextResponse.json({ ok: true })
}
