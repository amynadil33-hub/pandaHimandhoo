"use client"

import useSWR from "swr"
import { useState } from "react"
import { Plus, Loader2, Trash2, QrCode } from "lucide-react"
import type { RestaurantTable } from "@/lib/orders/types"
import { TableQrCard } from "@/components/admin/table-qr-card"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function AdminTablesManager({ baseUrl }: { baseUrl: string }) {
  const { data, isLoading, mutate } = useSWR<{ tables: RestaurantTable[] }>("/api/tables", fetcher)
  const tables = data?.tables ?? []

  const [tableNumber, setTableNumber] = useState("")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addTable(e: React.FormEvent) {
    e.preventDefault()
    if (!tableNumber.trim()) return
    setAdding(true)
    setError(null)
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_number: tableNumber.trim() }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error ?? "Could not add table.")
        return
      }
      setTableNumber("")
      mutate()
    } finally {
      setAdding(false)
    }
  }

  async function removeTable(id: string) {
    await fetch(`/api/tables/${id}`, { method: "DELETE" })
    mutate()
  }

  async function toggleActive(table: RestaurantTable) {
    await fetch(`/api/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !table.is_active }),
    })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tables & QR Codes</h1>
        <p className="text-sm text-muted-foreground">
          Create a table, then print its QR code. Guests scan it to order from their seat.
        </p>
      </div>

      {/* Add table */}
      <form
        onSubmit={addTable}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4"
      >
        <div className="flex-1 min-w-[160px]">
          <label htmlFor="tableNumber" className="mb-1.5 block text-sm font-medium">
            New table number / name
          </label>
          <input
            id="tableNumber"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. 9 or Terrace 1"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add table
        </button>
        {error ? <p className="w-full text-sm text-destructive">{error}</p> : null}
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : tables.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <QrCode className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-2 font-medium">No tables yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first table above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <TableQrCard
              key={table.id}
              table={table}
              url={`${baseUrl}/order/${table.qr_slug}`}
              onDelete={() => removeTable(table.id)}
              onToggle={() => toggleActive(table)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
