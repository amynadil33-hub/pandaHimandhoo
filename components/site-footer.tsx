import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Camera, ThumbsUp } from 'lucide-react'
import { navLinks, site } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6 md:py-16">
        <div className="md:col-span-1">
          <Image
            src="/icon.svg"
            alt="Panda Restaurant logo"
            width={180}
            height={80}
            className="h-12 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            {site.tagline}. Home-style island cooking, fresh seafood, and warm hospitality on
            Himandhoo Island.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.social.instagram}
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent"
            >
              <Camera className="size-4" />
            </a>
            <a
              href={site.social.facebook}
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent"
            >
              <ThumbsUp className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Explore</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-primary-foreground/80">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-primary-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Find Us</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span>{site.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-accent" />
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="hover:text-primary-foreground">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-primary-foreground">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Hours</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            {site.hours.map((h) => (
              <li key={h.days} className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  <span className="block font-medium text-primary-foreground">{h.days}</span>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/70 md:flex-row md:px-6">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Made with care in the Maldives.</p>
        </div>
      </div>
    </footer>
  )
}
