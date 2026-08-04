import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setSession(null)
          setLoading(false)
        }
        return
      }

      const { data } = await supabase.auth.getSession()

      if (mounted) {
        setSession(data.session)
        setLoading(false)
      }
    }

    loadSession()

    const { data: listener } = supabase?.auth?.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession)
        setLoading(false)
      }
    }) ?? { data: null }

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  if (!isSupabaseConfigured || !supabase) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 px-8 py-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">Memeriksa akses admin…</p>
          <p className="mt-2 text-sm text-slate-500">Silakan tunggu sebentar.</p>
        </div>
      </div>
    )
  }

  return session ? children : <Navigate to="/login" replace />
}
