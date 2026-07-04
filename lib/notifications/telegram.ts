import type { Order, OrderItem } from "@/lib/orders/types";
import {
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/orders/types";

export type TelegramOrderPayload = {
  order_id: string;
  order_number: number | string;
  order_type: Order["order_type"] | string;
  table_number?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  delivery_address?: string | null;
  pickup_time?: string | null;
  total_mvr: number | string;
  payment_method?: Order["payment_method"] | string | null;
  payment_status: Order["payment_status"] | string;
  order_status: Order["status"] | string;
  order_items: Array<Partial<OrderItem> & { name?: string; notes?: string }>;
  notification_type?: "new" | "confirmed";
};

function label(
  value: string | null | undefined,
  labels: Record<string, string>,
) {
  if (!value) return "Not provided";
  return labels[value] ?? value.replaceAll("_", " ");
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function orderToTelegramPayload(
  order: Order,
  notificationType: "new" | "confirmed" = "new",
): TelegramOrderPayload {
  return {
    order_id: order.id,
    order_number: order.order_number,
    order_type: order.order_type,
    table_number: order.table_number,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    delivery_address: order.delivery_address,
    pickup_time: order.pickup_time,
    total_mvr: order.total_mvr,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    order_status: order.status,
    order_items: order.items,
    notification_type: notificationType,
  };
}

export function formatTelegramOrderMessage(payload: TelegramOrderPayload) {
  const title =
    payload.notification_type === "confirmed"
      ? "✅ Order Confirmed - Panda Restaurant"
      : "🍽️ New Order - Panda Restaurant";
  const items = payload.order_items.length
    ? payload.order_items
        .map((item) => {
          const name = item.item_name ?? item.name ?? "Item";
          const notes = item.item_notes ?? item.notes;
          return `${item.quantity ?? 1}x ${name}${notes ? ` - ${notes}` : ""}`;
        })
        .join("\n")
    : "No items supplied";

  const locationLine =
    payload.order_type === "dine_in"
      ? `Table: ${payload.table_number || "Not assigned"}`
      : payload.order_type === "delivery"
        ? `Address: ${payload.delivery_address || "Not provided"}`
        : `Pickup Time: ${payload.pickup_time || "ASAP"}`;

  return escapeHtml(`${title}

Order: #${payload.order_number}
Type: ${label(payload.order_type, ORDER_TYPE_LABELS)}
${locationLine}
Customer: ${payload.customer_name || "Guest"}
Phone: ${payload.customer_phone || "Not provided"}

Items:
${items}

Total: MVR ${payload.total_mvr}
Payment: ${label(payload.payment_method, PAYMENT_METHOD_LABELS)}
Payment Status: ${label(payload.payment_status, PAYMENT_STATUS_LABELS)}
Order Status: ${label(payload.order_status, ORDER_STATUS_LABELS)}

Please check the admin dashboard.`);
}

export async function sendTelegramOrderNotification(
  payload: TelegramOrderPayload,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return {
      ok: false,
      error: "Telegram bot token or chat ID is not configured.",
    };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramOrderMessage(payload),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, error: text || `Telegram API returned ${res.status}` };
  }
  return { ok: true, error: null };
}
