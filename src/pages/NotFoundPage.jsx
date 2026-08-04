import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Alamat yang Anda buka belum terdaftar di navigasi desa. Silakan kembali ke beranda atau gunakan menu utama.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}