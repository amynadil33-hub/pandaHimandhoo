'use client'

import type { OrderType, RestaurantSettings } from '@/lib/orders/types'

export type CheckoutDetails = {
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_landmark: string
  delivery_notes: string
  delivery_timing: 'asap' | 'scheduled'
  scheduled_time: string
  pickup_time: string
  notes: string
}

export const emptyDetails: CheckoutDetails = {
  customer_name: '',
  customer_phone: '',
  delivery_address: '',
  delivery_landmark: '',
  delivery_notes: '',
  delivery_timing: 'asap',
  scheduled_time: '',
  pickup_time: '',
  notes: '',
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'
const textareaClass =
  'w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30'

export function CheckoutForm({
  orderType,
  value,
  onChange,
  settings,
}: {
  orderType: OrderType
  value: CheckoutDetails
  onChange: (next: CheckoutDetails) => void
  settings: RestaurantSettings
}) {
  const set = (patch: Partial<CheckoutDetails>) => onChange({ ...value, ...patch })

  const nameRequired = orderType !== 'dine_in'
  const phoneRequired = orderType !== 'dine_in'

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Name"
        optional={!nameRequired}
        htmlFor="name"
      >
        <input
          id="name"
          className={inputClass}
          value={value.customer_name}
          onChange={(e) => set({ customer_name: e.target.value })}
          placeholder="Your name"
          autoComplete="name"
        />
      </Field>

      <Field label="Phone number" optional={!phoneRequired} htmlFor="phone">
        <input
          id="phone"
          type="tel"
          className={inputClass}
          value={value.customer_phone}
          onChange={(e) => set({ customer_phone: e.target.value })}
          placeholder="+960 …"
          autoComplete="tel"
        />
      </Field>

      {orderType === 'delivery' && (
        <>
          <Field label="Delivery address / location" htmlFor="address">
            <textarea
              id="address"
              rows={2}
              className={textareaClass}
              value={value.delivery_address}
              onChange={(e) => set({ delivery_address: e.target.value })}
              placeholder="House name, area on Himandhoo"
            />
          </Field>
          <Field label="Landmark" optional htmlFor="landmark">
            <input
              id="landmark"
              className={inputClass}
              value={value.delivery_landmark}
              onChange={(e) => set({ delivery_landmark: e.target.value })}
              placeholder="Near the harbour, beside the mosque…"
            />
          </Field>
          <Field label="Delivery instructions" optional htmlFor="delivery-notes">
            <input
              id="delivery-notes"
              className={inputClass}
              value={value.delivery_notes}
              onChange={(e) => set({ delivery_notes: e.target.value })}
              placeholder="Call on arrival, leave at door…"
            />
          </Field>
          <Field label="When do you need it?">
            <div className="flex gap-2">
              <TimingChip
                active={value.delivery_timing === 'asap'}
                onClick={() => set({ delivery_timing: 'asap' })}
              >
                ASAP
              </TimingChip>
              <TimingChip
                active={value.delivery_timing === 'scheduled'}
                onClick={() => set({ delivery_timing: 'scheduled' })}
              >
                Schedule
              </TimingChip>
            </div>
            {value.delivery_timing === 'scheduled' && (
              <input
                type="time"
                className={`${inputClass} mt-2`}
                value={value.scheduled_time}
                onChange={(e) => set({ scheduled_time: e.target.value })}
              />
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              {settings.delivery_area_note} Est. {settings.estimated_delivery_time}.
            </p>
          </Field>
        </>
      )}

      {orderType === 'takeaway' && (
        <Field label="Pickup time" htmlFor="pickup">
          <input
            id="pickup"
            type="time"
            className={inputClass}
            value={value.pickup_time}
            onChange={(e) => set({ pickup_time: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Leave empty for ASAP. Est. {settings.estimated_prep_time}.
          </p>
        </Field>
      )}

      <Field label="Order notes" optional htmlFor="order-notes">
        <textarea
          id="order-notes"
          rows={2}
          className={textareaClass}
          value={value.notes}
          onChange={(e) => set({ notes: e.target.value })}
          placeholder="Any notes for the whole order"
        />
      </Field>
    </div>
  )
}

function Field({
  label,
  optional,
  htmlFor,
  children,
}: {
  label: string
  optional?: boolean
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

function TimingChip({
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
      aria-pressed={active}
      className={
        'flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ' +
        (active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card hover:bg-secondary')
      }
    >
      {children}
    </button>
  )
}
