import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/admin-auth"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin")
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4">
      <AdminLoginForm />
    </div>
  )
}
