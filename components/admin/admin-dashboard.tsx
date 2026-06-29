"use client"

import useSWR from "swr"
import { useMemo } from "react"
import { ClipboardList, ChefHat, BellRing, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import { type Order, isActiveStatus } from "@/lib/orders/types"
import { AdminOrderCard } from "@/components/admin/admin-order-card"
import { formatMvr } from "@/lib/format"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function AdminDashboard() {
  const { data, isLoading, mutate, isValidating } = useSWR<{ orders: Order[] }>(
    "/api/orders",
    fetcher,
    { refreshInterval: 6000 },
  )
  const orders = data?.orders ?? []

  const stats = useMemo(() => {
    const today = orders.filter((o) => isToday(o.created_at))
    const active = orders.filter((o) => isActiveStatus(o.status))
    const preparing = orders.filter((o) => o.status === "preparing")
    const ready = orders.filter((o) => o.status === "ready")
    const revenue = today
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total_mvr, 0)
    return {
      activeCount: active.length,
      preparing: preparing.length,
      ready: ready.length,
      revenue,
      todayCount: today.length,
    }
  }, [orders])

  const activeOrders = orders.filter((o) => isActiveStatus(o.status))

  // Group into columns by stage
  const columns = useMemo(() => {
    const incoming = activeOrders.filter((o) =>
      ["payment_pending", "new", "confirmed"].includes(o.status),
    )
    const kitchen = activeOrders.filter((o) => o.status === "preparing")
    const ready = activeOrders.filter((o) =>
      ["ready", "out_for_delivery", "served"].includes(o.status),
    )
    return { incoming, kitchen, ready }
  }, [activeOrders])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Orders</h1>
          <p className="text-sm text-muted-foreground">Updates automatically every few seconds.</p>
        </div>
        <button
          onClick={() => mutate()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          {isValidating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={ClipboardList} label="Active orders" value={String(stats.activeCount)} />
        <StatCard icon={ChefHat} label="In kitchen" value={String(stats.preparing)} />
        <StatCard icon={BellRing} label="Ready" value={String(stats.ready)} />
        <StatCard icon={TrendingUp} label="Today's revenue" value={formatMvr(stats.revenue)} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <p className="font-medium">No active orders right now</p>
          <p className="mt-1 text-sm text-muted-foreground">New orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Column title="Incoming" count={columns.incoming.length} accent="bg-blue-500">
            {columns.incoming.map((o) => (
              <AdminOrderCard key={o.id} order={o} onChanged={mutate} />
            ))}
          </Column>
          <Column title="In Kitchen" count={columns.kitchen.length} accent="bg-indigo-500">
            {columns.kitchen.map((o) => (
              <AdminOrderCard key={o.id} order={o} onChanged={mutate} />
            ))}
          </Column>
          <Column title="Ready / Serving" count={columns.ready.length} accent="bg-emerald-500">
            {columns.ready.map((o) => (
              <AdminOrderCard key={o.id} order={o} onChanged={mutate} />
            ))}
          </Column>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

function Column({
  title,
  count,
  accent,
  children,
}: {
  title: string
  count: number
  accent: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`size-2.5 rounded-full ${accent}`} />
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {count === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Empty
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  )
}
