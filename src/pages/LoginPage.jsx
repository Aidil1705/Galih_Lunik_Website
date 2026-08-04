import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Card } from '../components/Card'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      if (!isSupabaseConfigured || !supabase) {
        return
      }

      const { data } = await supabase.auth.getSession()
      if (mounted && data.session) {
        navigate('/management', { replace: true })
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    if (!isSupabaseConfigured || !supabase) {
      setMessage('Konfigurasi Supabase belum lengkap. Periksa variabel environment.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    navigate('/management', { replace: true })
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Admin Area</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">Masuk ke panel management</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Gunakan akun Supabase yang sudah terdaftar untuk mengelola informasi desa, berita, dan galeri foto.
          </p>
        </div>

        <Card className="max-w-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0"
                placeholder="admin@desa.id"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-0"
                placeholder="Masukkan password"
                required
              />
            </div>

            {message ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{message}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}
