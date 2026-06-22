'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

const fieldClass =
  'w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // No backend wired — surface a friendly confirmation.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-secondary/50 p-8 text-center ring-1 ring-border">
        <CheckCircle2 className="size-12 text-primary" />
        <h3 className="mt-4 font-heading text-xl font-semibold">Thank you!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your message has been noted. For the fastest response, give us a call or message us on
          WhatsApp and we&apos;ll get right back to you.
        </p>
        <Button className="mt-6 rounded-full" onClick={() => setSubmitted(false)} variant="outline">
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required className={fieldClass} placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={fieldClass}
            placeholder="+960 ..."
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass}
          placeholder="you@example.com"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-none`}
          placeholder="Tell us how we can help — reservations, large orders, feedback..."
        />
      </div>
      <Button type="submit" size="lg" className="mt-1 w-full rounded-full sm:w-fit">
        Send Message
      </Button>
    </form>
  )
}
