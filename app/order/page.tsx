import Link from "next/link"
import { ShoppingBag, Bike, UtensilsCrossed, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Order Online",
  description: "Order takeaway or delivery from our kitchen.",
}

const options = [
  {
    href: "/order/takeaway",
    icon: ShoppingBag,
    title: "Takeaway",
    desc: "Order ahead and pick it up at the counter.",
  },
  {
    href: "/order/delivery",
    icon: Bike,
    title: "Delivery",
    desc: "Get your favourites delivered to your door.",
  },
]

export default function OrderLandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">How would you like to order?</h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Choose an option below. Dining in? Scan the QR code on your table to order from your seat.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary hover:bg-accent"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <opt.icon className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">{opt.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{opt.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start order
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 p-5">
          <span className="flex size-10 items-center justify-center rounded-full bg-foreground/5 text-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
          <div>
            <p className="font-medium">Dining in?</p>
            <p className="text-sm text-muted-foreground">
              Scan the QR code on your table to browse the menu and order directly from your seat.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
