import { useMemo, useState } from 'react'
import { School2 } from 'lucide-react'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { SectionHeading } from '../components/SectionHeading'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useEducationFacilities } from '../hooks/useVillageData'
import { formatNumber } from '../lib/dataHelpers'

const EMPTY_ROWS = []

export function PendidikanPage() {
  const facilitiesQuery = useEducationFacilities()
  const [selectedType, setSelectedType] = useState('Semua')

  useDocumentTitle('Pendidikan | Desa Galih Lunik')

  const facilities = facilitiesQuery.data ?? EMPTY_ROWS

  const types = useMemo(
    () => ['Semua', ...new Set(facilities.map((item) => item.type).filter(Boolean))],
    [facilities],
  )

  const filteredFacilities = useMemo(
    () => (selectedType === 'Semua' ? facilities : facilities.filter((item) => item.type === selectedType)),
    [facilities, selectedType],
  )

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SectionHeading
        eyebrow="Pendidikan"
        title="Daftar fasilitas pendidikan di desa"
        description="Card di bawah ini ditarik dari tabel education_facilities dan bisa difilter berdasarkan jenis fasilitas."
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Total Fasilitas</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{formatNumber(facilities.length)}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Jumlah data yang berhasil dimuat dari Supabase.</p>
        </Card>
        <Card className="p-5 md:col-span-1 xl:col-span-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Filter Jenis Fasilitas</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  selectedType === type
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50',
                ].join(' ')}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-10">
        {facilitiesQuery.isFetching && facilities.length === 0 ? (
          <LoadingState count={4} className="md:grid-cols-2 xl:grid-cols-4" />
        ) : facilities.length === 0 ? (
          <EmptyState
            title="Belum ada fasilitas pendidikan"
            description="Isi tabel education_facilities agar daftar fasilitas pendidikan dapat ditampilkan."
          />
        ) : filteredFacilities.length === 0 ? (
          <EmptyState
            title="Tidak ada data untuk filter ini"
            description="Coba pilih jenis fasilitas lain atau tambahkan data baru pada education_facilities."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFacilities.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <School2 className="h-10 w-10 text-emerald-700" />
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{item.type || 'Fasilitas'}</p>
                    {item.students !== null && item.students !== undefined ? (
                      <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {formatNumber(item.students)} siswa
                      </p>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.address || 'Alamat belum diisi di tabel education_facilities.'}</p>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}