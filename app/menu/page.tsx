import type { Metadata } from 'next'
import { getMenu } from '@/lib/menu'
import { MenuItemCard } from '@/components/menu-item-card'
import { CategoryNav } from '@/components/menu/category-nav'
import { Info } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Menu | Panda Restaurant',
  description:
    'Browse the full Panda Restaurant menu — breakfast, Maldivian favourites, fried rice, kothu roshi, biryani, pasta, snacks and drinks. Prices in MVR.',
}

// Always reflect the latest menu from Supabase.
export const revalidate = 60

export default async function MenuPage() {
  const { categories, usingFallback } = await getMenu()
  const navCategories = categories
    .filter((c) => c.items.length > 0)
    .map((c) => ({ slug: c.slug, name: c.name }))

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:px-6 md:py-16">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Eat well, island style
          </span>
          <h1 className="mt-2 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Our Menu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Everything is made fresh to order. All prices are in Maldivian Rufiyaa (MVR) and include
            service.
          </p>
        </div>
      </section>

      <CategoryNav categories={navCategories} />

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        {usingFallback && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" />
            <p>
              Showing sample menu data. Connect your Supabase project (add{' '}
              <code className="rounded bg-background px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
              and{' '}
              <code className="rounded bg-background px-1 py-0.5 text-xs">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
              ) and run the SQL scripts to load your live menu.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-14">
          {categories
            .filter((c) => c.items.length > 0)
            .map((category) => (
              <section key={category.id} id={category.slug} className="scroll-mt-36">
                <div className="border-b-2 border-primary/20 pb-3">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-primary md:text-3xl">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  {category.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </>
  )
}
