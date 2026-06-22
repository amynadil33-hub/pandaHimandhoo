import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Fish, Leaf, HandHeart } from 'lucide-react'

const highlights = [
  { icon: Fish, title: 'Fresh local catch', text: 'Reef fish and tuna sourced from island fishermen.' },
  { icon: Leaf, title: 'Made from scratch', text: 'Curries, roshi and sauces prepared in-house daily.' },
  { icon: HandHeart, title: 'Island hospitality', text: 'Warm, family-run service that feels like home.' },
]

export function StorySection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative order-last md:order-first">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src="/images/about-restaurant.png"
              alt="The warm, inviting interior of Panda Restaurant"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Our story
          </span>
          <h2 className="mt-2 text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Home-style Maldivian cooking, rooted in the islands
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Panda Restaurant started with a simple idea: serve the food we grew up on, made with
            care and the freshest ingredients the islands have to offer. From garudhiya to grilled
            fish, every plate carries a little piece of home.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {highlights.map((h) => (
              <li key={h.title} className="flex flex-col gap-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <h.icon className="size-5" />
                </span>
                <span className="font-heading text-sm font-semibold">{h.title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{h.text}</span>
              </li>
            ))}
          </ul>

          <Button
            render={<Link href="/about" />}
            nativeButton={false}
            className="mt-8 rounded-full"
          >
            More about us
          </Button>
        </div>
      </div>
    </section>
  )
}
