import { NextResponse } from 'next/server'
import { createTable, listTables } from '@/lib/orders/store'
import { isAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const tables = await listTables()
  return NextResponse.json({ tables })
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = (await req.json()) as { table_number?: string; qr_slug?: string }
  if (!body.table_number?.trim()) {
    return NextResponse.json({ error: 'Table number is required.' }, { status: 400 })
  }
  const slug =
    body.qr_slug?.trim() ||
    `table-${body.table_number.trim().toLowerCase().replace(/\s+/g, '-')}`
  try {
    const table = await createTable({ table_number: body.table_number.trim(), qr_slug: slug })
    return NextResponse.json({ table })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not create table'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
