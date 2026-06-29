'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react'
import type { MenuCategory } from '@/lib/menu'
import { useCart } from '@/lib/cart-context'
import { priceOrder } from '@/lib/orders/pricing'
import { formatMVR } from '@/lib/format'
import {
  ORDER_TYPE_LABELS,
  type OrderType,
  type PaymentMethod,
  type RestaurantSettings,
} from '@/lib/orders/types'
import { Button } from '@/components/ui/button'
import { OrderMenu } from './order-menu'
import { CartReview } from './cart-review'
import { OrderSummary } from './order-summary'
import { CheckoutForm, emptyDetails, type CheckoutDetails } from './checkout-form'
import { PaymentMethodSelector } from './payment-method-selector'
import { BankTransferInstructions } from './bank-transfer-instructions'
import { SlipUpload } from './slip-upload'

type Step = 'cart' | 'details' | 'payment'

export function OrderingExperience({
  categories,
  settings,
  orderType,
  table,
}: {
  categories: MenuCategory[]
  settings: RestaurantSettings
  orderType: OrderType
  table?: { id: string; table_number: string } | null
}) {
  const router = useRouter()
  const { items, count, subtotal, clear, hydrated } = useCart()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('cart')
  const [details, setDetails] = useState<CheckoutDetails>(emptyDetails)
  const [method, setMethod] = useState<PaymentMethod | null>(null)
  const [slip, setSlip] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { total } = priceOrder(items, orderType, settings)
  const belowMinimum = orderType === 'delivery' && subtotal < settings.minimum_order_mvr

  function goToCheckout() {
    setError('')
    setStep('cart')
    setOpen(true)
  }

  function next() {
    setError('')
    if (step === 'cart') {
      if (items.length === 0) return setError('Your cart is empty.')
      if (belowMinimum)
        return setError(
          `Minimum delivery order is ${formatMVR(settings.minimum_order_mvr)}.`,
        )
      return setStep('details')
    }
    if (step === 'details') {
      if (orderType !== 'dine_in') {
        if (!details.customer_name.trim()) return setError('Please enter your name.')
        if (!details.customer_phone.trim()) return setError('Please enter your phone number.')
      }
      if (orderType === 'delivery' && !details.delivery_address.trim())
        return setError('Please enter your delivery address.')
      return setStep('payment')
    }
  }

  async function placeOrder() {
    setError('')
    if (!method) return setError('Please choose a payment method.')
    if (method === 'bank_transfer' && !slip)
      return setError('Please upload your payment slip to continue.')

    setSubmitting(true)
    const pickupTime =
      orderType === 'delivery'
        ? details.delivery_timing === 'asap'
          ? 'ASAP'
          : details.scheduled_time
        : details.pickup_time || 'ASAP'

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_type: orderType,
          table_id: table?.id ?? null,
          table_number: table?.table_number ?? null,
          customer_name: details.customer_name || null,
          customer_phone: details.customer_phone || null,
          delivery_address: orderType === 'delivery' ? details.delivery_address : null,
          delivery_landmark: orderType === 'delivery' ? details.delivery_landmark : null,
          delivery_notes: orderType === 'delivery' ? details.delivery_notes : null,
          pickup_time: orderType === 'dine_in' ? null : pickupTime,
          payment_method: method,
          notes: details.notes || null,
          slip_image_url: slip,
          source: table ? 'table_qr' : 'website',
          items: items.map((i) => ({
            menu_item_id: i.id,
            item_name: i.name,
            item_price_mvr: i.price_mvr,
            quantity: i.quantity,
            item_notes: i.notes || null,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not place order')
      clear()
      router.push(`/order/confirmation/${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order')
      setSubmitting(false)
    }
  }

  const stepTitle =
    step === 'cart' ? 'Your order' : step === 'details' ? 'Your details' : 'Payment'

  return (
    <>
      <OrderMenu categories={categories} />

      {/* Sticky bottom cart bar */}
      {hydrated && count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Button
              onClick={goToCheckout}
              className="h-12 flex-1 rounded-full text-base [&_svg]:size-5"
            >
              <ShoppingBag />
              <span>Review order · {count}</span>
              <span className="ml-auto tabular-nums">{formatMVR(total)}</span>
            </Button>
          </div>
        </div>
      )}
      {/* Spacer so content isn't hidden behind the bar */}
      {hydrated && count > 0 && <div className="h-20" aria-hidden />}

      {/* Checkout overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <header className="flex h-14 items-center gap-2 border-b border-border px-4">
            <button
              type="button"
              aria-label="Back"
              onClick={() => {
                setError('')
                if (step === 'cart') setOpen(false)
                else if (step === 'details') setStep('cart')
                else setStep('details')
              }}
              className="inline-flex size-9 items-center justify-center rounded-full hover:bg-secondary"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="font-heading text-base font-semibold leading-none">{stepTitle}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ORDER_TYPE_LABELS[orderType]}
                {table ? ` · Table ${table.table_number}` : ''}
              </p>
            </div>
            <StepDots step={step} className="ml-auto" />
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-5">
              {step === 'cart' && (
                <div className="flex flex-col gap-5">
                  <CartReview />
                  {items.length > 0 && (
                    <div className="rounded-xl border border-border bg-card p-4">
                      <OrderSummary items={items} orderType={orderType} settings={settings} showItems={false} />
                    </div>
                  )}
                </div>
              )}

              {step === 'details' && (
                <CheckoutForm
                  orderType={orderType}
                  value={details}
                  onChange={setDetails}
                  settings={settings}
                />
              )}

              {step === 'payment' && (
                <div className="flex flex-col gap-5">
                  <PaymentMethodSelector
                    orderType={orderType}
                    settings={settings}
                    value={method}
                    onChange={setMethod}
                  />
                  {method === 'bank_transfer' && (
                    <div className="flex flex-col gap-4">
                      <BankTransferInstructions settings={settings} total={total} />
                      <SlipUpload value={slip} onChange={setSlip} />
                    </div>
                  )}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <OrderSummary items={items} orderType={orderType} settings={settings} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="border-t border-border p-3">
            <div className="mx-auto max-w-2xl">
              {error && (
                <p className="mb-2 text-center text-sm font-medium text-destructive">{error}</p>
              )}
              {step === 'payment' ? (
                <Button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="h-12 w-full rounded-full text-base [&_svg]:size-5"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : null}
                  {submitting ? 'Placing order…' : `Place order · ${formatMVR(total)}`}
                </Button>
              ) : (
                <Button
                  onClick={next}
                  disabled={items.length === 0}
                  className="h-12 w-full rounded-full text-base"
                >
                  Continue · {formatMVR(total)}
                </Button>
              )}
            </div>
          </footer>
        </div>
      )}
    </>
  )
}

function StepDots({ step, className }: { step: Step; className?: string }) {
  const order: Step[] = ['cart', 'details', 'payment']
  const index = order.indexOf(step)
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
      {order.map((s, i) => (
        <span
          key={s}
          className={
            'h-1.5 rounded-full transition-all ' +
            (i <= index ? 'w-5 bg-primary' : 'w-1.5 bg-border')
          }
        />
      ))}
    </div>
  )
}
