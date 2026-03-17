'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: '1px solid var(--slate-200)',
        borderRadius: 8,
        padding: '0.5rem 1rem',
        color: 'var(--slate-600)',
        fontSize: '0.875rem',
        cursor: 'pointer',
      }}
    >
      Sign Out
    </button>
  )
}