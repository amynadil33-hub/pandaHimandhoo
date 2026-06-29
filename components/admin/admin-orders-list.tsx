"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import {
  type Order,
  type OrderStatus,
  type OrderType,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
} from "@/lib/orders/types"
import { AdminOrderCard } from "@/components/admin/admin-order-card"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const STATUS_FILTERS: ("all" | "active" | OrderStatus)[] = [
  "all",
  "active",
  "payment_pending",
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]

const TYPE_FILTERS: ("all" | OrderType)[] = ["all", "dine_in", "takeaway", "delivery"]

export function AdminOrdersList() {
  const { data, isLoading, mutate } = useSWR<{ orders: Order[] }>("/api/orders", fetcher, {
    refreshInterval: 8000,
  })
  const orders = data?.orders ?? []

  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all")
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (type !== "all" && o.order_type !== type) return false
      if (status === "active" && (o.status === "completed" || o.status === "cancelled")) return false
      if (status !== "all" && status !== "active" && o.status !== status) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        const haystack = [
          `#${o.order_number}`,
          o.customer_name,
          o.customer_phone,
          o.table_number,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [orders, status, type, query])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Orders</h1>
        <p className="text-sm text-muted-foreground">Search, filter and manage every order.</p>
      </div>

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
            <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
              {s === "all" ? "All" : s === "active" ? "Active" : ORDER_STATUS_LABELS[s]}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setType(t)} variant="type">
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
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((o) => (
            <AdminOrderCard key={o.id} order={o} onChanged={mutate} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  variant = "status",
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  variant?: "status" | "type"
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
  )
}
