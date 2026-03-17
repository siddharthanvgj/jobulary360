import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--slate-200)',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ color: 'var(--teal)', fontSize: '1.5rem', fontWeight: 700 }}>
          Jobulary 360
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem', marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Assessments', value: assessments?.length ?? 0 },
            { label: 'Active', value: assessments?.filter(a => a.status === 'active').length ?? 0 },
            { label: 'Completed', value: assessments?.filter(a => a.status === 'completed').length ?? 0 },
          ].map(card => (
            <div key={card.label} style={{
              background: '#fff', borderRadius: 12, padding: '1.5rem',
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
            }}>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                {card.label}
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--teal)' }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff', borderRadius: 12, padding: '1.5rem',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: 600 }}>
            Recent Assessments
          </h2>
          {assessments && assessments.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Title', 'Status', 'Created'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '0.75rem',
                      borderBottom: '2px solid var(--slate-200)',
                      color: 'var(--slate-600)', fontSize: '0.875rem'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assessments.map(a => (
                  <tr key={a.id}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
                      {a.title}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem', borderRadius: 20,
                        background: a.status === 'completed' ? '#d1fae5' : '#e0f2fe',
                        color: a.status === 'completed' ? '#065f46' : '#0369a1',
                        fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--slate-100)', color: 'var(--slate-600)', fontSize: '0.875rem' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--slate-600)', textAlign: 'center', padding: '2rem' }}>
              No assessments yet. Create your first one!
            </p>
          )}
        </div>
      </main>
    </div>
  )
}