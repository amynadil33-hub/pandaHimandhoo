import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star, UtensilsCrossed } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
            <UtensilsCrossed className="size-3.5 text-accent" />
            Himandhoo · Maldives
          </span>
          <h1 className="mt-5 text-balance font-heading text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            A taste of the islands, served fresh every day.
          </h1>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            From mas huni at sunrise to sizzling kothu roshi at night, Panda Restaurant brings
            home-style Maldivian cooking and fresh seafood to your table.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/menu" />}
              nativeButton={false}
              size="lg"
              className="rounded-full"
            >
              View the Menu
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              Find Us
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-accent text-accent" />
              ))}
            </div>
            <span>Loved by island locals &amp; travellers alike</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl md:aspect-square">
            <Image
              src="/images/hero-maldivian-spread.png"
              alt="An overhead spread of authentic Maldivian dishes including mas huni, biryani and grilled fish"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 hidden rounded-2xl bg-card px-5 py-4 shadow-lg ring-1 ring-border sm:block md:-left-6">
            <p className="font-heading text-2xl font-semibold text-primary">40+</p>
            <p className="text-xs text-muted-foreground">dishes made fresh daily</p>
          </div>
        </div>
      </div>
    </section>
  )
}
