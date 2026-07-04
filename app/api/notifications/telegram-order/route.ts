import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  sendTelegramOrderNotification,
  type TelegramOrderPayload,
} from "@/lib/notifications/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TelegramOrderPayload;
  try {
    body = (await req.json()) as TelegramOrderPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const result = await sendTelegramOrderNotification(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, warning: result.error },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true });
}
