import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatMVR } from '@/components/menu-item-card'

const featured = [
  {
    name: 'Grilled Fish with Rice & Salad',
    description: 'Fresh reef fish grilled to order, served with rice and a crisp garden salad.',
    price: 120,
    image: '/images/dish-grilled-fish.png',
    badge: "Chef's Pick",
  },
  {
    name: 'Chicken Kothu Roshi',
    description: 'Chopped roshi stir-fried with chicken, vegetables and island spices.',
    price: 85,
    image: '/images/dish-kothu-roshi.png',
    badge: 'Popular',
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant spiced basmati rice layered with tender chicken.',
    price: 95,
    image: '/images/dish-biryani.png',
    badge: 'Popular',
  },
]

export function FeaturedDishes() {
  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Signature plates
            </span>
            <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              The dishes everyone comes back for
            </h2>
          </div>
          <Button
            render={<Link href="/menu" />}
            nativeButton={false}
            variant="ghost"
            className="rounded-full"
          >
            See full menu
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((dish) => (
            <article
              key={dish.name}
              className="group overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent backdrop-blur">
                  {dish.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold leading-tight">{dish.name}</h3>
                  <span className="shrink-0 font-heading font-semibold text-primary">
                    {formatMVR(dish.price)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {dish.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
