export function slugifyText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function pickText(record, fields, fallback = '') {
  for (const field of fields) {
    const value = record?.[field]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value)
    }
  }

  return fallback
}

export function pickNumber(record, fields, fallback = null) {
  for (const field of fields) {
    const value = record?.[field]

    if (value === undefined || value === null || value === '') {
      continue
    }

    const parsedValue = Number(String(value).replace(/,/g, '').replace(/\s/g, ''))

    if (!Number.isNaN(parsedValue)) {
      return parsedValue
    }
  }

  return fallback
}

export function splitParagraphs(value) {
  if (!value) {
    return []
  }

  return String(value)
    .split(/\n|\r\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatNumber(value, locale = 'id-ID') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-'
  }

  return new Intl.NumberFormat(locale).format(Number(value))
}

export function sortRowsByDate(rows, fields = ['published_at', 'created_at', 'updated_at', 'date']) {
  return [...rows].sort((left, right) => {
    const leftValue = fields
      .map((field) => left?.[field])
      .find((value) => value !== undefined && value !== null && value !== '')
    const rightValue = fields
      .map((field) => right?.[field])
      .find((value) => value !== undefined && value !== null && value !== '')

    return new Date(rightValue ?? 0) - new Date(leftValue ?? 0)
  })
}

export function sortRowsByYear(rows) {
  return [...rows].sort((left, right) => (Number(right.year ?? right.tahun ?? 0) - Number(left.year ?? left.tahun ?? 0)))
}

export function getUniqueValues(rows, fields) {
  const values = new Set()

  rows.forEach((row) => {
    fields.forEach((field) => {
      const value = row?.[field]
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        values.add(String(value))
      }
    })
  })

  return [...values]
}

export function getLatestYear(rows) {
  const years = rows
    .map((row) => Number(row.year ?? row.tahun))
    .filter((value) => !Number.isNaN(value))

  return years.length > 0 ? Math.max(...years) : null
}

export function groupBy(rows, getKey) {
  return rows.reduce((accumulator, row) => {
    const key = getKey(row)

    if (!accumulator[key]) {
      accumulator[key] = []
    }

    accumulator[key].push(row)
    return accumulator
  }, {})
}

export function sumRows(rows, fields = ['value', 'jumlah', 'total', 'count']) {
  return rows.reduce((sum, row) => {
    const value = fields
      .map((field) => row?.[field])
      .find((candidate) => candidate !== undefined && candidate !== null && candidate !== '')

    const numericValue = Number(String(value ?? 0).replace(/,/g, '').replace(/\s/g, ''))
    return sum + (Number.isNaN(numericValue) ? 0 : numericValue)
  }, 0)
}

export function getPopulationEstimate(rows) {
  if (rows.length === 0) {
    return null
  }

  const populationRow = rows.find((row) => {
    const text = `${row?.label ?? row?.nama ?? row?.name ?? ''} ${row?.category ?? row?.kategori ?? ''}`.toLowerCase()
    return text.includes('penduduk') || text.includes('population') || text.includes('total')
  })

  if (populationRow) {
    return pickNumber(populationRow, ['value', 'jumlah', 'total', 'count'])
  }

  return sumRows(rows)
}