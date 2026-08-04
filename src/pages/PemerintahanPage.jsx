import { useOutletContext } from 'react-router-dom'
import { Building2, Landmark } from 'lucide-react'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { SectionHeading } from '../components/SectionHeading'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useInstitutions, useServiceSchedules } from '../hooks/useVillageData'

export function PemerintahanPage() {
  const { profile } = useOutletContext()
  const institutionsQuery = useInstitutions()
  const schedulesQuery = useServiceSchedules()

  useDocumentTitle('Pemerintahan | Desa Galih Lunik')

  const institutions = institutionsQuery.data ?? []
  const schedules = schedulesQuery.data ?? []

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SectionHeading
        eyebrow="Pemerintahan Desa"
        title="Struktur organisasi, lembaga desa, dan jadwal pelayanan"
        description="Bagian ini menampilkan bagan organisasi dari village_profile, daftar institutions, serta jadwal service_schedules dari Supabase."
      />

      <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <div className="h-72 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
            {profile?.orgChartImageUrl ? (
              <img src={profile.orgChartImageUrl} alt="Bagan struktur organisasi desa" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-7 text-slate-600">
                Tambahkan org_chart_image_url atau org_chart_image_path pada village_profile untuk menampilkan bagan struktur organisasi.
              </div>
            )}
          </div>
          <div className="space-y-2 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Bagan Organisasi</p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">{profile?.villageName ?? 'Desa Galih Lunik'}</h2>
            <p className="text-sm leading-7 text-slate-600">Struktur pemerintahan yang rapi membantu warga memahami jalur koordinasi pelayanan dan pengambilan keputusan.</p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Koordinasi Pelayanan</p>
              <p className="text-sm text-slate-600">Informasi ringkas diambil dari tabel village_profile dan service_schedules.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Kepala Desa</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{profile?.headName || 'Isi head_name pada village_profile untuk menampilkan nama kepala desa.'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Jam Kerja</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{profile?.hours || 'Isi operating_hours pada village_profile.'}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Lembaga Desa"
          title="Daftar lembaga dan organisasi pendukung"
          description="Setiap card menampilkan logo, nama, ketua, dan deskripsi lembaga desa dari tabel institutions."
        />

        {institutionsQuery.isFetching && institutions.length === 0 ? (
          <LoadingState count={4} className="md:grid-cols-2 xl:grid-cols-4" />
        ) : institutions.length === 0 ? (
          <EmptyState
            title="Belum ada data lembaga"
            description="Tambahkan data pada tabel institutions agar daftar lembaga desa muncul."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {institutions.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100 p-4">
                  {item.logoUrl ? (
                    <img src={item.logoUrl} alt={item.name} className="h-full w-full object-contain" />
                  ) : (
                    <Building2 className="h-10 w-10 text-emerald-700" />
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Ketua: {item.leader || '-'}</p>
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
          eyebrow="Jadwal Pelayanan"
          title="Pelayanan kantor desa per hari"
          description="Tabel berikut menampilkan jadwal dari service_schedules, diurutkan sesuai hari layanan."
        />

        {schedulesQuery.isFetching && schedules.length === 0 ? (
          <LoadingState count={1} />
        ) : schedules.length === 0 ? (
          <EmptyState
            title="Belum ada jadwal pelayanan"
            description="Tambahkan data pada tabel service_schedules untuk menampilkan jadwal kantor desa."
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
                <thead className="bg-emerald-50/80 text-emerald-700">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Hari</th>
                    <th className="px-5 py-4 font-semibold">Layanan</th>
                    <th className="px-5 py-4 font-semibold">Jam Buka</th>
                    <th className="px-5 py-4 font-semibold">Jam Tutup</th>
                    <th className="px-5 py-4 font-semibold">Petugas</th>
                    <th className="px-5 py-4 font-semibold">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {schedules.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 font-semibold text-slate-900">{item.day}</td>
                      <td className="px-5 py-4">{item.serviceName || '-'}</td>
                      <td className="px-5 py-4">{item.openTime || '-'}</td>
                      <td className="px-5 py-4">{item.closeTime || '-'}</td>
                      <td className="px-5 py-4">{item.officer || '-'}</td>
                      <td className="px-5 py-4">{item.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}