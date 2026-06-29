import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { OrderTracker } from "@/components/order/order-tracker"
import { getOrder } from "@/lib/orders/store"

export const dynamic = "force-dynamic"

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)
  if (!order) notFound()

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/menu"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to menu
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Thank you for your order!</h1>
        <p className="mt-1 text-muted-foreground">
          Track your order status below. This page updates automatically.
        </p>
      </div>
      <OrderTracker orderId={order.id} initialOrder={order} />
    </main>
  )
}
