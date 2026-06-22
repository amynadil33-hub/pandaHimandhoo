'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type NavCategory = { slug: string; name: string }

export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    categories.forEach((c) => {
      const el = document.getElementById(c.slug)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [categories])

  const handleClick = (slug: string) => {
    const el = document.getElementById(slug)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 140
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-16 z-40 -mx-4 border-b border-border bg-background/90 px-4 backdrop-blur-md md:top-20">
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => handleClick(c.slug)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              active === c.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
