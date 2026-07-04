import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Panda Restaurant | Modern Island Dining in Himandhoo',
    template: '%s | Panda Restaurant',
  },
  description:
    'Panda Restaurant is a modern island restaurant in Himandhoo Island, Alifu Alifu Atoll, Maldives, serving Maldivian favourites, fried rice, kothu roshi, biryani, pasta, sandwiches, breakfast and drinks.',
  keywords: [
    'Panda Restaurant',
    'Himandhoo restaurant',
    'Himandhoo Island',
    'Alifu Alifu Atoll',
    'Maldives restaurant',
    'Maldivian food',
    'kothu roshi',
    'fried rice Maldives',
    'restaurant in Himandhoo',
    'island dining Maldives',
  ],
  openGraph: {
    title: 'Panda Restaurant | Modern Island Dining in Himandhoo',
    description:
      'Fresh flavours, comforting meals and relaxed Maldivian island dining at Panda Restaurant in Himandhoo Island, Maldives.',
    type: 'website',
    images: ['/icon.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda Restaurant | Modern Island Dining in Himandhoo',
    description:
      'Fresh flavours, comforting meals and relaxed Maldivian island dining at Panda Restaurant in Himandhoo Island, Maldives.',
    images: ['/icon.svg'],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1f5f63',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
