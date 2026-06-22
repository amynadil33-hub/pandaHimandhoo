import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Fish, Leaf, HandHeart, Soup } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About | Panda Restaurant',
  description:
    'Learn the story behind Panda Restaurant — a family-run kitchen serving authentic, home-style Maldivian food on Himandhoo Island.',
}

const values = [
  {
    icon: Fish,
    title: 'Fresh from the reef',
    text: 'We work with local fishermen to bring in tuna and reef fish at their freshest.',
  },
  {
    icon: Soup,
    title: 'Recipes from home',
    text: 'Our curries and broths follow recipes passed down through generations.',
  },
  {
    icon: Leaf,
    title: 'Made from scratch',
    text: 'Roshi, sauces and spice blends are all prepared in-house, every single day.',
  },
  {
    icon: HandHeart,
    title: 'Genuine hospitality',
    text: 'A welcoming, family-run space where every guest feels at home.',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative">
        <div className="relative h-[42vh] min-h-72 w-full overflow-hidden md:h-[52vh]">
          <Image
            src="/images/about-restaurant.png"
            alt="Inside Panda Restaurant"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/55" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
                Our story
              </span>
              <h1 className="mt-2 max-w-2xl text-balance font-heading text-4xl font-semibold tracking-tight text-primary-foreground md:text-6xl">
                A little taste of the islands, made with love
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <div className="space-y-5 text-pretty leading-relaxed text-muted-foreground">
          <p className="text-lg text-foreground">
            Panda Restaurant began as a small family kitchen with one goal — to share the comforting,
            flavour-packed food we grew up eating across the Maldives.
          </p>
          <p>
            From the first plate of mas huni in the morning to a steaming bowl of garudhiya at night,
            our menu is a celebration of island life. We cook the way our families taught us: with
            patience, fresh ingredients, and a whole lot of heart.
          </p>
          <p>
            Today we serve locals, neighbours and travellers alike, but the spirit stays the same —
            honest food, fair prices, and the warm welcome the Maldives is known for.
          </p>
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Our home
          </span>
          <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Rooted in Himandhoo Island
          </h2>
          <div className="mt-5 space-y-5 text-pretty leading-relaxed text-muted-foreground">
            <p>
              You&apos;ll find us on Himandhoo, a small inhabited island in Alifu Alifu (North Ari)
              Atoll, about 85km west of Malé. With a community of around a thousand people, it&apos;s
              the kind of place where life moves to the rhythm of the tide and everyone knows their
              neighbour.
            </p>
            <p>
              Himandhoo is proud of its history — from its resistance during colonial times to the
              centuries-old Medhuziyaaraiy mosque once hidden in the island&apos;s jungle. That same
              spirit of holding on to tradition is exactly how we approach our cooking, keeping the
              old island recipes and crafts alive.
            </p>
            <p>
              The island is wrapped in a vibrant house reef full of turtles, rays and reef fish, and
              our tuna comes straight from the boats that dock at our harbour. It&apos;s this fresh,
              just-off-the-reef catch and the easy island hospitality that ends up on every plate we
              serve.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              What we stand for
            </span>
            <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
              The things that never change
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <v.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6 md:py-20">
        <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Come taste the difference
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Browse our full menu or stop by — we&apos;d love to have you at our table.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
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
            Visit Us
          </Button>
        </div>
      </section>
    </>
  )
}
