import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const ADMIN_COOKIE = 'panda_admin'

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'panda2024'
}

function tokenFor(password: string) {
  return createHash('sha256').update(`panda::${password}`).digest('hex')
}

export function expectedToken() {
  return tokenFor(adminPassword())
}

export function checkPassword(password: string) {
  return password === adminPassword()
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === expectedToken()
}

export async function setAdminSession() {
  const store = await cookies()
  store.set(ADMIN_COOKIE, expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

export { ADMIN_COOKIE }
