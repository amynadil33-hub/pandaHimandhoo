"use client";

import useSWR from "swr";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Search, Loader2, Bell, BellOff, Volume2 } from "lucide-react";
import {
  type Order,
  type OrderStatus,
  type OrderType,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from "@/lib/orders/types";
import { AdminOrderCard } from "@/components/admin/admin-order-card";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_FILTERS: ("all" | "active" | OrderStatus)[] = [
  "all",
  "active",
  "payment_pending",
  "new",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

const TYPE_FILTERS: ("all" | OrderType)[] = [
  "all",
  "dine_in",
  "online",
  "takeaway",
  "delivery",
];

export function AdminOrdersList() {
  const { data, isLoading, mutate } = useSWR<{ orders: Order[] }>(
    "/api/orders",
    fetcher,
    {
      refreshInterval: 8000,
    },
  );
  const orders = data?.orders ?? [];

  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("all");
  const [query, setQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const triggerNewOrderAlert = useCallback(
    (orderId: string) => {
      setToast("New order received");
      setHighlightedOrderId(orderId);
      document.title = "New Order - Panda Restaurant";

      if (soundEnabled && !muted && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setSoundEnabled(false));
      }

      window.setTimeout(() => setToast(null), 5000);
      window.setTimeout(() => setHighlightedOrderId(null), 10000);
      window.setTimeout(() => {
        if (document.title === "New Order - Panda Restaurant")
          document.title = "Panda Restaurant";
      }, 12000);
    },
    [muted, soundEnabled],
  );

  async function enableSound() {
    if (!audioRef.current) return;
    audioRef.current.volume = 1;
    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSoundEnabled(true);
      setMuted(false);
      setToast("Order sound enabled");
      window.setTimeout(() => setToast(null), 3000);
    } catch {
      setToast("Tap again to allow order sound");
      window.setTimeout(() => setToast(null), 4000);
    }
  }

  useEffect(() => {
    audioRef.current = new Audio("/sounds/new-order.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1;
  }, []);

  useEffect(() => {
    const currentIds = new Set(orders.map((order) => order.id));
    if (!initialized.current) {
      knownOrderIds.current = currentIds;
      initialized.current = true;
      return;
    }
    const newest = orders.find((order) => !knownOrderIds.current.has(order.id));
    knownOrderIds.current = currentIds;
    if (newest) triggerNewOrderAlert(newest.id);
  }, [orders, triggerNewOrderAlert]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return;

    const supabase = createClient(url, anonKey);
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const orderId =
            typeof payload.new.id === "string" ? payload.new.id : null;
          const orderType = typeof payload.new.order_type === "string" ? payload.new.order_type : null;
          if (!["dine_in", "takeaway", "delivery", "online"].includes(orderType ?? "")) return;
          mutate();
          if (orderId) {
            knownOrderIds.current.add(orderId);
            triggerNewOrderAlert(orderId);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate, triggerNewOrderAlert]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (type !== "all" && o.order_type !== type) return false;
      if (
        status === "active" &&
        (o.status === "completed" || o.status === "cancelled")
      )
        return false;
      if (status !== "all" && status !== "active" && o.status !== status)
        return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = [
          `#${o.order_number}`,
          o.customer_name,
          o.customer_phone,
          o.table_number,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [orders, status, type, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Orders</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter and manage every order.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <button
          type="button"
          onClick={enableSound}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Volume2 className="size-4" />
          {soundEnabled ? "Order Sound Enabled" : "Enable Order Sound"}
        </button>
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
        >
          {muted ? <BellOff className="size-4" /> : <Bell className="size-4" />}
          {muted ? "Sound muted" : "Mute sound"}
        </button>
        <p className="text-xs text-muted-foreground">
          Keep this page open for real-time order alerts.
        </p>
      </div>

      {toast ? (
        <div className="fixed right-4 top-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-lg">
          {toast}
        </div>
      ) : null}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order #, name, phone or table"
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <FilterChip
              key={s}
              active={status === s}
              onClick={() => setStatus(s)}
            >
              {s === "all"
                ? "All"
                : s === "active"
                  ? "Active"
                  : ORDER_STATUS_LABELS[s]}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((t) => (
            <FilterChip
              key={t}
              active={type === t}
              onClick={() => setType(t)}
              variant="type"
            >
              {t === "all" ? "All types" : ORDER_TYPE_LABELS[t]}
            </FilterChip>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="font-medium">No matching orders</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((o) => (
            <AdminOrderCard
              key={o.id}
              order={o}
              onChanged={mutate}
              highlighted={highlightedOrderId === o.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  variant = "status",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "status" | "type";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? variant === "type"
            ? "border-foreground bg-foreground text-background"
            : "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}
