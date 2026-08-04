import { pickNumber, pickText, slugifyText, splitParagraphs } from './dataHelpers'
import { resolveImageUrl } from './imageUrl'

export function normalizeVillageProfile(record = {}) {
  return {
    id: record.id ?? 'village-profile',
    villageName: pickText(record, ['village_name', 'name', 'desa_name'], 'Desa Galih Lunik'),
    tagline: pickText(record, ['tagline', 'subtitle', 'slogan'], ''),
    history: pickText(record, ['history', 'sejarah'], ''),
    headGreeting: pickText(
      record,
      ['head_message', 'welcome_message', 'sambutan_kepala_desa', 'greeting'],
      '',
    ),
    vision: splitParagraphs(pickText(record, ['vision', 'visi'], '')),
    mission: splitParagraphs(pickText(record, ['mission', 'misi'], '')),
    geography: pickText(record, ['geography', 'geografis', 'lokasi_geografis'], ''),
    latitude: pickNumber(record, ['latitude', 'lat'], null),
    longitude: pickNumber(record, ['longitude', 'lng', 'lon'], null),
    areaSize: pickText(record, ['area_size', 'luas_wilayah', 'area'], ''),
    heroImageUrl: resolveImageUrl(record, {
      urlFields: ['hero_image_url', 'hero_url'],
      pathFields: ['hero_image_path', 'hero_path'],
      bucketFields: ['hero_bucket'],
    }),
    regionMapImageUrl: resolveImageUrl(record, {
      urlFields: ['region_map_image_url', 'region_map_url'],
      pathFields: ['region_map_image_path', 'region_map_path'],
      bucketFields: ['region_map_bucket'],
    }),
    orgChartImageUrl: resolveImageUrl(record, {
      urlFields: ['org_chart_image_url', 'org_chart_url'],
      pathFields: ['org_chart_image_path', 'org_chart_path'],
      bucketFields: ['org_chart_bucket'],
    }),
    headName: pickText(record, ['head_name', 'kades_name', 'village_head_name'], ''),
    address: pickText(record, ['address', 'alamat'], ''),
    phone: pickText(record, ['phone', 'telepon'], ''),
    email: pickText(record, ['email', 'surat_email'], ''),
    hours: pickText(record, ['operating_hours', 'jam_kerja'], ''),
    contactNote: pickText(record, ['contact_note', 'catatan_kontak'], ''),
  }
}

export function normalizeNews(record = {}) {
  return {
    id: record.id ?? `${record.title ?? record.judul ?? 'news'}-${record.published_at ?? ''}`,
    title: pickText(record, ['title', 'judul'], ''),
    excerpt: pickText(record, ['excerpt', 'description', 'deskripsi'], ''),
    category: pickText(record, ['category', 'kategori'], ''),
    author: pickText(record, ['author', 'penulis'], ''),
    publishedAt: record.published_at ?? record.publishedAt ?? record.date ?? null,
    isPublished: record.is_published ?? record.isPublished ?? true,
    imageUrl: resolveImageUrl(record, {
      urlFields: ['image_url', 'cover_url', 'photo_url'],
      pathFields: ['image_path', 'cover_path', 'photo_path'],
      bucketFields: ['bucket'],
    }),
  }
}

export function normalizeGalleryItem(record = {}) {
  return {
    id: record.id ?? `${record.title ?? record.caption ?? 'gallery'}-${record.created_at ?? ''}`,
    title: pickText(record, ['title', 'judul'], ''),
    caption: pickText(record, ['caption', 'keterangan', 'description'], ''),
    album: pickText(record, ['album', 'kategori'], ''),
    publishedAt: record.created_at ?? record.published_at ?? null,
    imageUrl: resolveImageUrl(record, {
      urlFields: ['image_url', 'photo_url', 'url'],
      pathFields: ['image_path', 'photo_path'],
      bucketFields: ['bucket'],
    }),
  }
}

export function normalizePotential(record = {}) {
  return {
    id: record.id ?? `${record.name ?? record.nama ?? 'potential'}-${record.category ?? ''}`,
    name: pickText(record, ['name', 'nama', 'title', 'judul'], ''),
    category: pickText(record, ['category', 'kategori', 'type', 'jenis'], ''),
    description: pickText(record, ['description', 'deskripsi', 'excerpt'], ''),
    imageUrl: resolveImageUrl(record, {
      urlFields: ['image_url', 'photo_url'],
      pathFields: ['image_path', 'photo_path'],
      bucketFields: ['bucket'],
    }),
  }
}

export function normalizeInstitution(record = {}) {
  return {
    id: record.id ?? `${record.name ?? record.nama ?? 'institution'}-${record.leader ?? ''}`,
    name: pickText(record, ['name', 'nama'], ''),
    description: pickText(record, ['description', 'deskripsi'], ''),
    leader: pickText(record, ['leader', 'ketua', 'head'], ''),
    logoUrl: resolveImageUrl(record, {
      urlFields: ['logo_url', 'image_url'],
      pathFields: ['logo_path', 'image_path'],
      bucketFields: ['bucket'],
    }),
  }
}

export function normalizeServiceSchedule(record = {}) {
  return {
    id: record.id ?? `${record.day ?? record.hari ?? 'schedule'}-${record.service_name ?? ''}`,
    day: pickText(record, ['day', 'hari'], ''),
    serviceName: pickText(record, ['service_name', 'nama_layanan', 'service'], ''),
    openTime: pickText(record, ['open_time', 'jam_buka', 'start_time'], ''),
    closeTime: pickText(record, ['close_time', 'jam_tutup', 'end_time'], ''),
    officer: pickText(record, ['officer', 'petugas'], ''),
    note: pickText(record, ['note', 'catatan'], ''),
    dayOrder: record.day_order ?? record.sort_order ?? getDayOrder(record.day ?? record.hari),
  }
}

export function normalizeDemographic(record = {}) {
  const categoryText = pickText(record, ['category', 'kategori', 'type', 'demographic_type'], '')
  const labelText = pickText(record, ['label', 'nama', 'name', 'subcategory', 'sub_category'], '')

  return {
    id: record.id ?? `${categoryText}-${labelText}-${record.year ?? record.tahun ?? ''}`,
    year: Number(record.year ?? record.tahun ?? record.year_data ?? null),
    category: slugifyText(categoryText),
    categoryLabel: categoryText || 'Data',
    label: labelText,
    value: pickNumber(record, ['value', 'jumlah', 'total', 'count'], 0) ?? 0,
  }
}

export function normalizeEducationFacility(record = {}) {
  return {
    id: record.id ?? `${record.name ?? record.nama ?? 'facility'}-${record.type ?? record.jenis ?? ''}`,
    name: pickText(record, ['name', 'nama'], ''),
    type: pickText(record, ['type', 'jenis'], ''),
    address: pickText(record, ['address', 'alamat'], ''),
    students: pickNumber(record, ['students', 'jumlah_siswa', 'student_count'], null),
    description: pickText(record, ['description', 'deskripsi'], ''),
    imageUrl: resolveImageUrl(record, {
      urlFields: ['image_url', 'photo_url'],
      pathFields: ['image_path', 'photo_path'],
      bucketFields: ['bucket'],
    }),
  }
}

export function getDayOrder(dayLabel = '') {
  const orderMap = {
    senin: 1,
    selasa: 2,
    rabu: 3,
    kamis: 4,
    jumat: 5,
    sabtu: 6,
    minggu: 7,
  }

  return orderMap[slugifyText(dayLabel)] ?? 99
}
