import { getSupabaseServerClient } from '@/lib/supabase/server'
import { fallbackMenu } from '@/lib/menu-fallback'

export type MenuItem = {
  id: string
  category_id: string
  name: string
  description: string | null
  price_mvr: number
  image_url: string | null
  badges: string[]
  is_popular: boolean
  is_available: boolean
  sort_order: number
}

export type MenuCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  items: MenuItem[]
}

/**
 * Fetches the full menu grouped by category.
 * Falls back to local sample data when Supabase env vars are not yet set,
 * so the site renders during development.
 */
export async function getMenu(): Promise<{
  categories: MenuCategory[]
  usingFallback: boolean
}> {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return { categories: fallbackMenu, usingFallback: true }
  }

  const [{ data: categories, error: catError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from('menu_categories')
        .select('id, name, slug, description, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select(
          'id, category_id, name, description, price_mvr, image_url, badges, is_popular, is_available, sort_order',
        )
        .eq('is_active', true)
        .eq('is_available', true)
        .order('sort_order', { ascending: true }),
    ])

  if (catError || itemError || !categories) {
    return { categories: fallbackMenu, usingFallback: true }
  }

  const grouped: MenuCategory[] = categories.map((category) => ({
    ...category,
    items: (items ?? []).filter((item) => item.category_id === category.id),
  }))

  return { categories: grouped, usingFallback: false }
}

/** Returns a flat list of popular items for the homepage. */
export async function getPopularItems(limit = 6): Promise<MenuItem[]> {
  const { categories } = await getMenu()
  return categories
    .flatMap((c) => c.items)
    .filter((i) => i.is_popular)
    .slice(0, limit)
}
