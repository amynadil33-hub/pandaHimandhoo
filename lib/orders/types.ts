// Shared types and constants for the Panda Restaurant ordering system.

export type OrderType = "dine_in" | "takeaway" | "delivery" | "online";

export type OrderStatus =
  | "payment_pending"
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "served"
  | "completed"
  | "cancelled";

export type PaymentMethod =
  | "cash_at_table"
  | "cash_on_delivery"
  | "pay_at_pickup"
  | "bank_transfer"
  | "online";

export type PaymentStatus =
  | "unpaid"
  | "pending_review"
  | "paid"
  | "failed"
  | "refunded"
  | "pay_at_table"
  | "cash_on_delivery"
  | "pay_at_pickup";

export type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  item_price_mvr: number;
  quantity: number;
  item_notes: string | null;
  line_total_mvr: number;
};

export type Order = {
  id: string;
  order_number: number;
  order_type: OrderType;
  table_id: string | null;
  table_number: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  delivery_landmark: string | null;
  delivery_notes: string | null;
  pickup_time: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  subtotal_mvr: number;
  service_charge_mvr: number;
  delivery_fee_mvr: number;
  tax_mvr: number;
  total_mvr: number;
  notes: string | null;
  source: string;
  estimated_ready_time: string | null;
  slip_image_url: string | null;
  new_order_telegram_sent?: boolean | null;
  confirmed_order_telegram_sent?: boolean | null;
  last_notification_sent_at?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
};

export type RestaurantTable = {
  id: string;
  table_number: string;
  qr_slug: string;
  is_active: boolean;
  created_at: string;
};

export type RestaurantSettings = {
  id: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  payment_instructions: string;
  cash_enabled: boolean;
  bank_transfer_enabled: boolean;
  online_payment_enabled: boolean;
  delivery_enabled: boolean;
  takeaway_enabled: boolean;
  dine_in_enabled: boolean;
  service_charge_percent: number;
  tax_percent: number;
  delivery_fee_mvr: number;
  minimum_order_mvr: number;
  delivery_area_note: string;
  estimated_prep_time: string;
  estimated_delivery_time: string;
};

// ---------------------------------------------------------------------------
// Display labels & styling helpers
// ---------------------------------------------------------------------------

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  dine_in: "Dine-in",
  takeaway: "Takeaway",
  delivery: "Delivery",
  online: "Online",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  payment_pending: "Payment Pending",
  new: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Tailwind classes for each order status badge.
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  payment_pending: "bg-amber-100 text-amber-800 border-amber-200",
  new: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-sky-100 text-sky-800 border-sky-200",
  preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ready: "bg-emerald-100 text-emerald-800 border-emerald-200",
  out_for_delivery: "bg-violet-100 text-violet-800 border-violet-200",
  served: "bg-teal-100 text-teal-800 border-teal-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  pending_review: "Payment Pending Review",
  paid: "Paid",
  failed: "Payment Failed",
  refunded: "Refunded",
  pay_at_table: "Pay at Table",
  cash_on_delivery: "Cash on Delivery",
  pay_at_pickup: "Pay at Pickup",
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  unpaid: "bg-gray-100 text-gray-700 border-gray-200",
  pending_review: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-slate-100 text-slate-700 border-slate-200",
  pay_at_table: "bg-sky-100 text-sky-800 border-sky-200",
  cash_on_delivery: "bg-sky-100 text-sky-800 border-sky-200",
  pay_at_pickup: "bg-sky-100 text-sky-800 border-sky-200",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash_at_table: "Cash at Table",
  cash_on_delivery: "Cash on Delivery",
  pay_at_pickup: "Pay at Pickup",
  bank_transfer: "Bank Transfer",
  online: "Online Payment",
};

// Status flow used for the admin "advance order" actions.
export const NEXT_STATUS_FOR_TYPE: Record<OrderType, OrderStatus[]> = {
  dine_in: ["new", "confirmed", "preparing", "ready", "served", "completed"],
  takeaway: ["new", "confirmed", "preparing", "ready", "completed"],
  delivery: [
    "new",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "completed",
  ],
  online: ["new", "confirmed", "preparing", "ready", "completed"],
};

export function isActiveStatus(status: OrderStatus) {
  return status !== "completed" && status !== "cancelled";
}
