import { headers } from "next/headers"
import { AdminTablesManager } from "@/components/admin/admin-tables-manager"

export const dynamic = "force-dynamic"

export default async function AdminTablesPage() {
  // Build absolute base URL for QR links.
  const hdrs = await headers()
  const host = hdrs.get("host") ?? "localhost:3000"
  const protocol = host.includes("localhost") ? "http" : "https"
  const baseUrl = `${protocol}://${host}`
  return <AdminTablesManager baseUrl={baseUrl} />
}
