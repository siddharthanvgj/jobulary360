'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--paper)'
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '2.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 400
      }}>
        <h1 style={{ color: 'var(--teal)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>
          Jobulary 360
        </h1>
        <p style={{ color: 'var(--slate-600)', marginBottom: '2rem' }}>
          Sign in to your account
        </p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--slate-200)',
              fontSize: '1rem', outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--slate-200)',
              fontSize: '1rem', outline: 'none'
            }}
          />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: '0.875rem' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--teal)', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0.875rem', fontSize: '1rem',
              fontWeight: 600, opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}