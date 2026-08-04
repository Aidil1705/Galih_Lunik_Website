import { useMemo, useState } from 'react'
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
import { StatCard } from '../components/StatCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useDemographics } from '../hooks/useVillageData'
import {
  buildDemographicChartData,
  demographicCategories,
  filterDemographicRows,
  getAvailableDemographicYears,
  getLatestDemographicYear,
} from '../lib/demographicCharts'
import { formatNumber, sumRows } from '../lib/dataHelpers'

const pieColors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']
const EMPTY_ROWS = []

export function DataPage() {
  const demographicsQuery = useDemographics()

  useDocumentTitle('Data | Desa Galih Lunik')

  const demographics = demographicsQuery.data ?? EMPTY_ROWS
  const years = getAvailableDemographicYears(demographics)
  const latestYear = getLatestDemographicYear(demographics)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(demographicCategories[0]?.key ?? '')

  const activeYear = selectedYear ? Number(selectedYear) : latestYear
  const activeCategory = selectedCategory || demographicCategories[0]?.key || ''
  const categoryMeta = demographicCategories.find((item) => item.key === activeCategory) ?? demographicCategories[0]

  const rowsForSelection = useMemo(
    () => filterDemographicRows(demographics, activeYear, activeCategory),
    [demographics, activeYear, activeCategory],
  )

  const chartData = useMemo(
    () => buildDemographicChartData(rowsForSelection, activeCategory),
    [rowsForSelection, activeCategory],
  )

  const totalPopulation = sumRows(demographics.filter((row) => row.category === 'jenis_kelamin'))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <SectionHeading
        eyebrow="Data Kependudukan"
        title="Grafik dan ringkasan data dari Supabase"
        description="Gunakan filter tahun dan kategori untuk membaca data demographics dalam bentuk pie chart atau bar chart."
      />

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={latestYear ?? '-'} label="Tahun terbaru" description="Diambil dari kolom year/tahun pada tabel demographics." />
        <StatCard value={formatNumber(demographics.length)} label="Total baris" description="Jumlah data yang berhasil diambil dari Supabase." />
        <StatCard value={formatNumber(totalPopulation)} label="Total penduduk" description="Agregasi sederhana dari kategori jenis kelamin." />
        <StatCard value={categoryMeta?.label ?? '-'} label="Kategori aktif" description="Chart mengikuti kategori yang sedang dipilih." />
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          eyebrow="Filter"
          title="Pilih tahun dan kategori"
          description="Dropdown tahun dan tab kategori membantu menampilkan data yang relevan sesuai kebutuhan pembaca."
        />

        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Tahun
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="min-w-48 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500"
              >
                <option value="">Tahun terbaru</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-wrap gap-2">
              {demographicCategories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(category.key)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    selectedCategory === category.key
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                      : 'border border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50',
                  ].join(' ')}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10">
        {demographicsQuery.isFetching && demographics.length === 0 ? (
          <LoadingState count={1} />
        ) : demographics.length === 0 ? (
          <EmptyState
            title="Belum ada data demographics"
            description="Isi tabel demographics terlebih dahulu agar dashboard data dapat ditampilkan."
          />
        ) : (
          <ChartWrapper
            title={`${categoryMeta?.label ?? 'Kategori'} tahun ${activeYear ?? '-'}`}
            description={
              categoryMeta?.chartType === 'pie'
                ? 'Kategori jenis kelamin dan agama ditampilkan dalam pie chart.'
                : 'Kategori usia, pendidikan, dan pekerjaan ditampilkan dalam bar chart.'
            }
            emptyState={chartData.length === 0 ? <EmptyState title="Data untuk filter ini belum tersedia" description="Coba ganti tahun atau kategori, atau tambahkan baris baru pada demographics." /> : null}
          >
            {categoryMeta?.chartType === 'pie' ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartWrapper>
        )}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {demographicCategories.map((category) => {
          const categoryRows = demographics.filter((row) => row.category === category.key)
          const totalValue = sumRows(categoryRows)

          return (
            <Card key={category.key} className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{category.label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{formatNumber(totalValue)}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{categoryRows.length} baris data di tahun yang tersedia.</p>
            </Card>
          )
        })}
      </section>
    </div>
  )
}