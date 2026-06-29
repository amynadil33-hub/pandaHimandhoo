"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Download, Printer, Trash2, Power, ExternalLink } from "lucide-react"
import type { RestaurantTable } from "@/lib/orders/types"
import { cn } from "@/lib/utils"

export function TableQrCard({
  table,
  url,
  onDelete,
  onToggle,
}: {
  table: RestaurantTable
  url: string
  onDelete: () => void
  onToggle: () => void
}) {
  const [qr, setQr] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 480, margin: 2 })
      .then(setQr)
      .catch(() => setQr(null))
  }, [url])

  function download() {
    if (!qr) return
    const a = document.createElement("a")
    a.href = qr
    a.download = `panda-table-${table.table_number}-qr.png`
    a.click()
  }

  function print() {
    if (!qr) return
    const w = window.open("", "_blank", "width=600,height=700")
    if (!w) return
    w.document.write(`
      <html>
        <head><title>Table ${table.table_number} QR</title></head>
        <body style="font-family:system-ui,sans-serif;text-align:center;padding:40px;">
          <h1 style="margin:0 0 4px;">Panda Restaurant</h1>
          <p style="margin:0 0 24px;color:#555;font-size:18px;">Scan to order · Table ${table.table_number}</p>
          <img src="${qr}" style="width:320px;height:320px;" />
          <p style="margin-top:24px;color:#888;font-size:13px;">${url}</p>
        </body>
      </html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 300)
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-4",
        table.is_active ? "border-border" : "border-dashed border-border opacity-70",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Table {table.table_number}</p>
          <span
            className={cn(
              "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
              table.is_active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground",
            )}
          >
            {table.is_active ? "Active" : "Disabled"}
          </span>
        </div>
        <button
          onClick={onToggle}
          aria-label={table.is_active ? "Disable table" : "Enable table"}
          title={table.is_active ? "Disable" : "Enable"}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Power className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center rounded-lg bg-secondary p-3">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr || "/placeholder.svg"} alt={`QR code for table ${table.table_number}`} className="size-40" />
        ) : (
          <div className="size-40 animate-pulse rounded bg-muted" />
        )}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center justify-center gap-1 truncate text-xs text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="size-3 shrink-0" />
        <span className="truncate">{url}</span>
      </a>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={download}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Download className="size-4" />
          Save
        </button>
        <button
          onClick={print}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Printer className="size-4" />
          Print
        </button>
      </div>

      {confirmDelete ? (
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={onDelete}
            className="flex-1 rounded-lg bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      )}
    </div>
  )
}
