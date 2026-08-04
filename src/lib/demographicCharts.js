import { groupBy, getLatestYear } from './dataHelpers'

export const demographicCategories = [
  { key: 'jenis_kelamin', label: 'Jenis Kelamin', chartType: 'pie' },
  { key: 'usia', label: 'Usia', chartType: 'bar' },
  { key: 'pendidikan', label: 'Pendidikan', chartType: 'bar' },
  { key: 'pekerjaan', label: 'Pekerjaan', chartType: 'bar' },
  { key: 'agama', label: 'Agama', chartType: 'pie' },
]

export function getAvailableDemographicYears(rows) {
  return [...new Set(rows.map((row) => row.year).filter((year) => Number.isFinite(year)))].sort(
    (left, right) => right - left,
  )
}

export function getLatestDemographicYear(rows) {
  return getLatestYear(rows)
}

export function filterDemographicRows(rows, year, category) {
  return rows.filter((row) => {
    const matchesYear = year ? row.year === year : true
    const matchesCategory = category ? row.category === category : true
    return matchesYear && matchesCategory
  })
}

export function buildDemographicChartData(rows, category) {
  const filteredRows = rows.filter((row) => row.category === category)

  const grouped = groupBy(filteredRows, (row) => row.label || row.categoryLabel || 'Lainnya')

  return Object.entries(grouped)
    .map(([name, items]) => ({
      name,
      value: items.reduce((sum, item) => sum + Number(item.value ?? 0), 0),
    }))
    .sort((left, right) => right.value - left.value)
}