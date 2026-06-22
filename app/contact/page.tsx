import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact | Panda Restaurant',
  description:
    'Get in touch with Panda Restaurant on Himandhoo Island, Alifu Alifu Atoll, Maldives. Find our address, opening hours, phone number and send us a message.',
}

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            We&apos;d love to hear from you
          </span>
          <h1 className="mt-2 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Questions, reservations or large orders? Reach out and our team will be happy to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Visit or call us</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Walk in any time during opening hours, or get in touch using the details below.
            </p>

            <ul className="mt-8 flex flex-col gap-5">
              <ContactRow icon={MapPin} label="Address" value={site.address} />
              <ContactRow
                icon={Phone}
                label="Phone"
                value={site.phone}
                href={`tel:${site.phone.replace(/\s/g, '')}`}
              />
              <ContactRow
                icon={MessageCircle}
                label="WhatsApp"
                value={site.whatsapp}
                href={`https://wa.me/${site.whatsapp.replace(/[^\d]/g, '')}`}
              />
              <ContactRow
                icon={Mail}
                label="Email"
                value={site.email}
                href={`mailto:${site.email}`}
              />
            </ul>

            <div className="mt-8 rounded-3xl bg-secondary/50 p-6 ring-1 ring-border">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h3 className="font-heading text-lg font-semibold">Opening hours</h3>
              </div>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{h.days}</span>
                    <span className="font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-border">
              <iframe
                title="Map showing Panda Restaurant location on Himandhoo Island, Maldives"
                src="https://www.google.com/maps?q=Himandhoo+Island+Alifu+Alifu+Atoll+Maldives&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-border md:p-8">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Send a message</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Fill in the form and we&apos;ll get back to you as soon as we can.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href?: string
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {href ? (
          <a href={href} className="font-medium transition-colors hover:text-primary">
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </li>
  )
}
