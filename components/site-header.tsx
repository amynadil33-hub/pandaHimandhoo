'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { navLinks, site } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground">
            P
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-semibold tracking-tight">{site.name}</span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Himandhoo · Maldives
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-primary',
                  active ? 'text-primary' : 'text-foreground/80',
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-accent" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Button
            render={<a href={`tel:${site.phone.replace(/\s/g, '')}`} />}
            nativeButton={false}
            className="rounded-full"
          >
            <Phone className="size-4" />
            Call to Order
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md px-3 py-3 text-base font-medium transition-colors',
                    active ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <Button
              render={<a href={`tel:${site.phone.replace(/\s/g, '')}`} />}
              nativeButton={false}
              className="mt-2 rounded-full"
            >
              <Phone className="size-4" />
              Call to Order
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
