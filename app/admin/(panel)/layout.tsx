import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/admin/login")
  }
  return <AdminShell>{children}</AdminShell>
}
