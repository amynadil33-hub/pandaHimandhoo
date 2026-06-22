import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, Phone } from 'lucide-react'
import { site } from '@/lib/site'

export function VisitCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-20">
        <div>
          <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Hungry? Come dine with us today.
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
            Drop by for breakfast, lunch or a late dinner, or call ahead to place your order for
            takeaway.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<a href={`tel:${site.phone.replace(/\s/g, '')}`} />}
              nativeButton={false}
              size="lg"
              variant="secondary"
              className="rounded-full"
            >
              <Phone className="size-4" />
              {site.phone}
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Get directions
            </Button>
          </div>
        </div>

        <div className="grid gap-4 rounded-3xl bg-primary-foreground/10 p-6 ring-1 ring-primary-foreground/15">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-heading font-semibold">Visit us</p>
              <p className="text-sm text-primary-foreground/80">{site.address}</p>
            </div>
          </div>
          <div className="h-px bg-primary-foreground/15" />
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-heading font-semibold">Opening hours</p>
              <ul className="mt-1 text-sm text-primary-foreground/80">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="text-primary-foreground/70">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
