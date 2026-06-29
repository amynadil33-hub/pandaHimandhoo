"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, ClipboardList, QrCode, LogOut, Menu, X, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/tables", label: "Tables & QR", icon: QrCode },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.replace("/admin/login")
    router.refresh()
  }

  function isActive(item: (typeof NAV)[number]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  const navLinks = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive(item)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
        >
          <item.icon className="size-4.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="min-h-dvh bg-muted/30 lg:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">Panda Admin</p>
            <p className="text-xs text-muted-foreground">Order Management</p>
          </div>
        </div>
        {navLinks}
        <button
          onClick={logout}
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="size-4.5" />
          Sign out
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-4" />
          </span>
          <p className="text-sm font-bold">Panda Admin</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-card p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-bold">Panda Admin</p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            {navLinks}
            <button
              onClick={logout}
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4.5" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}

      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  )
}
