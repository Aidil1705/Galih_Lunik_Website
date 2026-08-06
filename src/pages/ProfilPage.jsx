import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Landmark, Sparkles } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../components/Card'
import { ChartWrapper } from '../components/ChartWrapper'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { SectionHeading } from '../components/SectionHeading'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useDemographics, useVillagePotentials } from '../hooks/useVillageData'
import {
  buildDemographicChartData,
  demographicCategories,
  getAvailableDemographicYears,
  getLatestDemographicYear,
} from '../lib/demographicCharts'

const chartColors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
const EMPTY_ROWS = []

export function ProfilPage() {
  const { profile } = useOutletContext()
  const demographicsQuery = useDemographics()
  const potentialsQuery = useVillagePotentials()

  useDocumentTitle('Profil | Desa Galih Lunik')

  const demographics = demographicsQuery.data ?? EMPTY_ROWS
  const potentials = potentialsQuery.data ?? EMPTY_ROWS
  const years = getAvailableDemographicYears(demographics)
  const latestYear = getLatestDemographicYear(demographics)

  const yearRows = useMemo(
    () => demographics.filter((row) => (latestYear ? row.year === latestYear : true)),
    [demographics, latestYear],
  )

  const demographicCharts = demographicCategories.map((category) => ({
    ...category,
    data: buildDemographicChartData(yearRows, category.key),
  }))

  const officeMapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.6525506902826!2d105.37035897408894!3d-5.423303694555957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40ddb815505487%3A0xd89d75e23b17d60e!2sBalai%20Desa%20Galih%20Lunik!5e1!3m2!1sid!2sid!4v1785934610711!5m2!1sid!2sid'

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SectionHeading
        eyebrow="Profil Desa"
        title="Sejarah, visi, misi, dan gambaran geografis desa"
        description="Seluruh isi halaman ini diambil dari tabel village_profile, demographics, dan village_potentials di Supabase."
      />

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Sejarah Desa</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {profile?.villageName ?? 'Desa Galih Lunik'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            {profile?.history || 'Isi kolom history pada tabel village_profile untuk menampilkan sejarah desa secara lengkap.'}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Visi</p>
              {profile?.vision?.length ? (
                <ul className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {profile.vision.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Sparkles className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Tambahkan field vision atau visi pada tabel village_profile.
                </p>
              )}
            </Card>

            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Misi</p>
              {profile?.mission?.length ? (
                <ol className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                  {profile.mission.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Tambahkan field mission atau misi pada tabel village_profile.
                </p>
              )}
            </Card>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
              {profile?.regionMapImageUrl ? (
                <img
                  src={profile.regionMapImageUrl}
                  alt="Peta pembagian wilayah desa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm leading-7 text-slate-600">
                  Tambahkan region_map_image_url atau region_map_image_path pada village_profile untuk menampilkan gambar peta pembagian wilayah.
                </div>
              )}
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Peta Wilayah</p>
              <p className="text-sm leading-7 text-slate-600">
                {profile?.geography || 'Tambahkan geography pada village_profile untuk menampilkan letak geografis desa.'}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Kepala Desa</p>
                <p className="text-sm text-slate-600">
                  {profile?.headName || 'Tambahkan head_name pada village_profile'}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {profile?.headGreeting || 'Sambutan kepala desa akan muncul dari field head_message, welcome_message, atau sambutan_kepala_desa.'}
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Letak Geografis"
          title="Lokasi kantor desa di peta"
          description="Embed Google Maps berikut menampilkan Balai Desa Galih Lunik secara langsung."
        />
        <Card className="overflow-hidden p-0">
          <div className="h-[360px] w-full bg-slate-100">
            <iframe
              title="Lokasi kantor desa Galih Lunik di Google Maps"
              src={officeMapEmbedUrl}
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
            />
          </div>
        </Card>
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Demografi"
          title={latestYear ? `Grafik kependudukan tahun ${latestYear}` : 'Grafik kependudukan'}
          description={
            years.length > 0
              ? 'Kategori usia, jenis kelamin, pendidikan, pekerjaan, dan agama diolah dari tabel demographics.'
              : 'Belum ada data demografi di Supabase.'
          }
        />

        {demographicsQuery.isFetching && demographics.length === 0 ? (
          <LoadingState count={5} className="md:grid-cols-2 xl:grid-cols-3" />
        ) : demographics.length === 0 ? (
          <EmptyState
            title="Belum ada data demografi"
            description="Isi tabel demographics untuk menampilkan grafik pada halaman profil."
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {demographicCharts.map((chart) => (
              <ChartWrapper
                key={chart.key}
                title={chart.label}
                description={`Data tahun ${latestYear ?? '-'} dari tabel demographics.`}
                emptyState={
                  chart.data.length === 0 ? (
                    <EmptyState
                      title={`Data ${chart.label} belum ada`}
                      description="Tambahkan baris sesuai kategori di tabel demographics."
                    />
                  ) : null
                }
              >
                {chart.chartType === 'pie' ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={chart.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                      >
                        {chart.data.map((entry, index) => (
                          <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={chart.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartWrapper>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Potensi Desa"
          title="Daftar potensi unggulan"
          description="Grid card berikut memuat data dari village_potentials, lengkap dengan gambar, kategori, dan deskripsinya."
        />

        {potentialsQuery.isFetching && potentials.length === 0 ? (
          <LoadingState count={3} className="md:grid-cols-3" />
        ) : potentials.length === 0 ? (
          <EmptyState
            title="Belum ada potensi desa"
            description="Tambahkan data pada tabel village_potentials untuk menampilkan potensi unggulan."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {potentials.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-emerald-100 via-lime-100 to-stone-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    {item.category || 'Potensi'}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
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
