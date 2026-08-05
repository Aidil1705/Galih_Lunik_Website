import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navItems } from '../content/siteContent'

export function Navbar({ profile, isLoading = false }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-lg shadow-emerald-200">
            <img
              src="/images/Kabupaten-Lampung-Selatan-Logo.png"
              alt="Logo Kabupaten Lampung Selatan"
              className="h-full w-full object-contain p-1"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
              {isLoading ? 'Memuat...' : profile?.villageName ?? 'Desa Galih Lunik'}
            </span>
            <span className="block truncate text-sm text-slate-500">
              {profile?.tagline ?? 'Smart village profile'}
            </span>
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-emerald-100 bg-white p-3 text-slate-700 shadow-sm lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Buka navigasi"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                [
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {isOpen ? (
        <nav className="border-t border-emerald-100 bg-white px-4 py-4 lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 sm:px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50/60 text-slate-700 hover:bg-emerald-100',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}