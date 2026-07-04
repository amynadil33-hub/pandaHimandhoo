import { NextResponse } from "next/server";
import { getOrder, notifyOrder } from "@/lib/orders/store";
import {
  sendTelegramOrderNotification,
  type TelegramOrderPayload,
} from "@/lib/notifications/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: TelegramOrderPayload;
  try {
    body = (await req.json()) as TelegramOrderPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    if (body.order_id) {
      const order = await getOrder(body.order_id);
      if (order) {
        const result = await notifyOrder(order, body.notification_type ?? "new");
        const warning = "error" in result ? result.error : null;
        const skipped = "skipped" in result ? result.skipped : false;
        if (!result.ok) console.error("Telegram notification failed", warning);
        return NextResponse.json(
          result.ok ? { ok: true, skipped } : { ok: false, warning },
        );
      }
    }

    const result = await sendTelegramOrderNotification(body);
    if (!result.ok) {
      console.error("Telegram notification failed", result.error);
      return NextResponse.json({ ok: false, warning: result.error }, { status: 200 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram notification failed", error);
    return NextResponse.json({ ok: false, warning: "Telegram notification failed" }, { status: 200 });
  }
}
