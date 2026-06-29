import { NextResponse } from "next/server"
import { checkPassword, setAdminSession, clearAdminSession } from "@/lib/admin-auth"

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string }
  if (!checkPassword(body.password ?? "")) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 })
  }
  await setAdminSession()
  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
