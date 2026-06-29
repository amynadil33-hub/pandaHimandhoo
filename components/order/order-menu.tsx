'use client'

import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { MenuCategory } from '@/lib/menu'
import { useCart } from '@/lib/cart-context'
import { formatMVR } from '@/lib/format'
import { cn } from '@/lib/utils'
import { QuantityControl } from './quantity-control'

export function OrderMenu({ categories }: { categories: MenuCategory[] }) {
  const { items, add, increment, decrement } = useCart()
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    return categories
      .filter((c) => c.items.length > 0)
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => !q || i.name.toLowerCase().includes(q) || (i.description ?? '').toLowerCase().includes(q),
        ),
      }))
      .filter((c) => (active === 'all' || c.slug === active) && c.items.length > 0)
  }, [categories, active, query])

  const qtyFor = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the menu…"
          className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
        />
      </div>

      {/* Category filter chips */}
      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <FilterChip active={active === 'all'} onClick={() => setActive('all')}>
          All
        </FilterChip>
        {categories
          .filter((c) => c.items.length > 0)
          .map((c) => (
            <FilterChip key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>
              {c.name}
            </FilterChip>
          ))}
      </div>

      <div className="flex flex-col gap-8">
        {visibleCategories.map((category) => (
          <section key={category.id} id={category.slug} className="scroll-mt-28">
            <h2 className="mb-3 font-heading text-xl font-semibold text-primary">
              {category.name}
            </h2>
            <div className="grid gap-3">
              {category.items.map((item) => {
                const qty = qtyFor(item.id)
                return (
                  <article
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium leading-tight">{item.name}</h3>
                      {item.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <p className="mt-1.5 font-heading font-semibold text-primary">
                        {formatMVR(item.price_mvr)}
                      </p>
                    </div>
                    <div className="shrink-0 self-center">
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => add({ id: item.id, name: item.name, price_mvr: item.price_mvr })}
                          className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px"
                        >
                          <Plus className="size-4" />
                          Add
                        </button>
                      ) : (
                        <QuantityControl
                          value={qty}
                          onIncrement={() => increment(item.id)}
                          onDecrement={() => decrement(item.id)}
                        />
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ))}
        {visibleCategories.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No items match your search.</p>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground/80 hover:bg-secondary',
      )}
    >
      {children}
    </button>
  )
}
