'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { formatMVR } from '@/lib/format'
import type { RestaurantSettings } from '@/lib/orders/types'

export function BankTransferInstructions({
  settings,
  total,
}: {
  settings: RestaurantSettings
  total: number
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <h4 className="font-heading text-sm font-semibold">Bank transfer details</h4>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {settings.payment_instructions}
      </p>
      <dl className="mt-3 grid gap-2 text-sm">
        <CopyRow label="Bank" value={settings.bank_name} />
        <CopyRow label="Account name" value={settings.bank_account_name} />
        <CopyRow label="Account number" value={settings.bank_account_number} />
        <div className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
          <dt className="text-muted-foreground">Amount to transfer</dt>
          <dd className="font-heading font-semibold text-primary">{formatMVR(total)}</dd>
        </div>
      </dl>
    </div>
  )
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2 font-medium">
        {value}
        <button
          type="button"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            } catch {
              /* ignore */
            }
          }}
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
      </dd>
    </div>
  )
}
