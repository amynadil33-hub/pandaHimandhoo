import type { Metadata } from "next"
import Link from "next/link"
import { Bike, ShoppingBag, UtensilsCrossed } from "lucide-react"
import { getMenu } from "@/lib/menu"
import { getSettings } from "@/lib/orders/store"
import { OrderClient } from "@/components/order/order-client"

export const metadata: Metadata = {
  title: "Order Online | Panda Restaurant",
  description: "Order online from Panda Restaurant on Himandhoo Island.",
}

export const dynamic = "force-dynamic"

export default async function OnlineOrderPage() {
  const [{ categories }, settings] = await Promise.all([getMenu(), getSettings()])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
      <div className="mb-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShoppingBag className="size-5" />
          </span>
          <div>
            <h1 className="font-heading text-xl font-semibold">Online order</h1>
            <p className="text-sm text-muted-foreground">
              Place an online order and choose your payment method at checkout.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Link className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent" href="/order/takeaway">
            <ShoppingBag className="size-4" /> Takeaway
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent" href="/order/delivery">
            <Bike className="size-4" /> Delivery
          </Link>
          <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
            <UtensilsCrossed className="size-4" /> Scan table QR for dine-in
          </span>
        </div>
      </div>

      <OrderClient categories={categories} settings={settings} orderType="online" />
    </div>
  )
}
