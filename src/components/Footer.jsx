import { Clock3, Mail, MapPinned, Phone } from 'lucide-react'

export function Footer({ profile, isLoading = false }) {
  const address = profile?.address || 'Lengkapi alamat desa di tabel village_profile'
  const hours = profile?.hours || 'Lengkapi jam layanan di tabel village_profile'
  const email = profile?.email || 'Lengkapi email resmi di tabel village_profile'
  const phone = profile?.phone || 'Lengkapi nomor telepon di tabel village_profile'

  return (
    <footer className="border-t border-emerald-100 bg-slate-950 text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">Kontak Resmi</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {isLoading ? 'Memuat profil desa...' : profile?.villageName ?? 'Desa Galih Lunik'}
          </h2>
          <p className="text-sm leading-7 text-slate-300">
            {profile?.contactNote || 'Portal profil desa terhubung langsung dengan data Supabase untuk menampilkan informasi resmi, foto, dan statistik desa.'}
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-300">
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{address}</span>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{hours}</span>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{email}</span>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{phone}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}