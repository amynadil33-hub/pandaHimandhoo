import type { MenuItem } from '@/lib/menu'
import { cn } from '@/lib/utils'

export function formatMVR(price: number) {
  return `MVR ${Number(price).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

const badgeStyles: Record<string, string> = {
  Popular: 'bg-accent/15 text-accent',
  "Chef's Pick": 'bg-primary/10 text-primary',
  'Local Favourite': 'bg-primary/10 text-primary',
  New: 'bg-accent/15 text-accent',
  Breakfast: 'bg-secondary text-secondary-foreground',
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="flex items-baseline justify-between gap-4 border-b border-dashed border-border py-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold leading-tight">{item.name}</h3>
          {item.badges?.map((badge) => (
            <span
              key={badge}
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                badgeStyles[badge] ?? 'bg-secondary text-secondary-foreground',
              )}
            >
              {badge}
            </span>
          ))}
        </div>
        {item.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}
      </div>
      <div className="shrink-0 font-heading text-base font-semibold text-primary">
        {formatMVR(item.price_mvr)}
      </div>
    </article>
  )
}
