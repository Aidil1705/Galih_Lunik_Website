import { Link, useOutletContext } from 'react-router-dom'
import { MapPinned, Newspaper, Users } from 'lucide-react'
import {
  useGallery,
  useDemographics,
  useNews,
  useVillagePotentials,
} from '../hooks/useVillageData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { ImageGallery } from '../components/ImageGallery'
import { LoadingState } from '../components/LoadingState'
import { SectionHeading } from '../components/SectionHeading'
import { StatCard } from '../components/StatCard'
import { getPopulationEstimate, formatNumber } from '../lib/dataHelpers'

function stripHtml(value) {
  return String(value ?? '').replace(/<[^>]*>/g, '').trim()
}

export function HomePage() {
  const { profile } = useOutletContext()
  const newsQuery = useNews()
  const galleryQuery = useGallery()
  const potentialsQuery = useVillagePotentials()
  const demographicsQuery = useDemographics()

  useDocumentTitle('Beranda | Desa Galih Lunik')

  const heroImage = profile?.heroImageUrl || galleryQuery.data?.[0]?.imageUrl || ''
  const welcomeText = profile?.headGreeting || stripHtml(profile?.history)
  const newsItems = newsQuery.data?.slice(0, 4) ?? []
  const potentials = potentialsQuery.data?.slice(0, 3) ?? []
  const galleryItems = galleryQuery.data?.slice(0, 6) ?? []
  const currentYearRows = demographicsQuery.data ?? []
  const populationEstimate = getPopulationEstimate(currentYearRows)

  const stats = [
    {
      icon: Users,
      value: populationEstimate ? formatNumber(populationEstimate) : '-',
      label: 'Jumlah penduduk',
      description: 'Agregasi data kependudukan terbaru dari Supabase.',
    },
    {
      icon: MapPinned,
      value: profile?.areaSize || '-',
      label: 'Luas wilayah',
      description: 'Mengacu pada field area_size di village_profile.',
    },
    {
      icon: Newspaper,
      value: newsItems.length.toString().padStart(2, '0'),
      label: 'Berita terbaru',
      description: 'Item berita/pengumuman yang sudah dipublikasikan.',
    },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
              Smart Village Profile
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {profile?.villageName ?? 'Desa Galih Lunik'}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {profile?.tagline || 'Portal resmi profil desa yang terhubung langsung ke data Supabase untuk menampilkan informasi pemerintahan, layanan, potensi, dan galeri.'}
            </p>
            {welcomeText ? (
              <Card className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  Sambutan Kepala Desa
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{welcomeText}</p>
              </Card>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/profil"
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-700"
              >
                Lihat Profil
              </Link>
              <Link
                to="/data"
                className="rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Lihat Data
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-lime-400 p-2 shadow-xl shadow-emerald-200/50">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-[1.6rem] bg-slate-950/20">
              {heroImage ? (
                <img src={heroImage} alt="Hero desa" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[280px] items-end bg-gradient-to-br from-emerald-800 via-emerald-600 to-lime-400 p-6">
                  <p className="max-w-xs text-sm leading-7 text-white/90">
                    Tambahkan hero image di tabel village_profile atau gunakan galeri Supabase untuk menampilkan foto utama desa.
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.label} icon={item.icon} value={item.value} label={item.label} description={item.description} />
        ))}
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Berita Terbaru"
          title="Informasi publik yang sudah dipublikasikan"
          description="Tiga sampai lima berita/pengumuman terbaru ditarik langsung dari tabel news dengan is_published = true."
        />
        {newsQuery.isFetching && newsItems.length === 0 ? (
          <LoadingState count={3} className="md:grid-cols-3" />
        ) : newsItems.length === 0 ? (
          <EmptyState
            title="Belum ada berita yang dipublikasikan"
            description={
              newsQuery.isFetching
                ? 'Menunggu data dari Supabase.'
                : 'Tambahkan data pada tabel news dengan is_published = true.'
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {newsItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    {item.category || 'Berita'}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.excerpt}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Potensi Unggulan"
          title="Area yang menonjol di desa"
          description="Beberapa item dari tabel village_potentials ditampilkan sebagai highlight utama beranda."
        />
        {potentialsQuery.isFetching && potentials.length === 0 ? (
          <LoadingState count={3} className="md:grid-cols-3" />
        ) : potentials.length === 0 ? (
          <EmptyState title="Belum ada data potensi" description="Isi tabel village_potentials agar potensi unggulan muncul di beranda." />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {potentials.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-44 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : null}
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{item.category || 'Potensi'}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Galeri Foto"
          title="Cuplikan visual terbaru dari desa"
          description="Galeri ditarik dari tabel gallery dan gambar diambil dari Supabase Storage public bucket atau URL publik."
        />
        <ImageGallery
          items={galleryItems}
          loading={galleryQuery.isFetching && galleryItems.length === 0}
          emptyState={
            <EmptyState
              title="Belum ada foto galeri"
              description="Tambahkan item pada tabel gallery agar galeri beranda terisi."
            />
          }
        />
      </section>

      <section className="mt-10 grid gap-4 rounded-[2rem] border border-emerald-100 bg-emerald-50/80 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Akses Cepat</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Lihat profil, pemerintahan, data, dan pendidikan desa dari menu utama.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/profil" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Profil
          </Link>
          <Link to="/pemerintahan" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Pemerintahan
          </Link>
          <Link to="/pendidikan" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Pendidikan
          </Link>
        </div>
      </section>
    </div>
  )
}