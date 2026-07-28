export const navItems = [
  { path: '/', label: 'Beranda' },
  { path: '/profil', label: 'Profil' },
  { path: '/pemerintahan', label: 'Pemerintahan' },
  { path: '/data', label: 'Data' },
  { path: '/pendidikan', label: 'Pendidikan' },
]

export const pageTitles = {
  '/': 'Beranda | Desa Galih Lunik',
  '/profil': 'Profil | Desa Galih Lunik',
  '/pemerintahan': 'Pemerintahan | Desa Galih Lunik',
  '/data': 'Data | Desa Galih Lunik',
  '/pendidikan': 'Pendidikan | Desa Galih Lunik',
}

export const statistik = [
  { angka: '15', label: 'Dusun aktif' },
  { angka: '6.248', label: 'Jumlah penduduk' },
  { angka: '3,8 km²', label: 'Luas wilayah' },
  { angka: '14', label: 'Lembaga masyarakat' },
]

export const berita = [
  {
    tanggal: '13 Juli 2026',
    judul: 'Musyawarah Pembangunan Desa Galih Lunik menetapkan prioritas tahun berjalan',
    deskripsi:
      'Pemerintah desa bersama unsur masyarakat menyepakati penguatan jalan lingkungan, drainase, serta dukungan layanan sosial yang lebih merata.',
  },
  {
    tanggal: '10 Juli 2026',
    judul: 'Pelayanan administrasi desa diperluas untuk memudahkan warga',
    deskripsi:
      'Layanan surat keterangan, konsultasi data kependudukan, dan pengantar kebutuhan warga kini dibuka dengan alur yang lebih tertib dan cepat.',
  },
]

export const agenda = [
  'Pendaftaran bantuan sosial dan verifikasi data keluarga.',
  'Pelayanan surat pengantar dan administrasi kependudukan.',
  'Gotong royong kebersihan lingkungan dusun dan jalan desa.',
]

export const strukturPemerintahan = [
  {
    judul: 'Kepala Desa',
    isi: 'Mengarahkan kebijakan, memastikan pelayanan publik berjalan tertib, dan menjaga koordinasi lintas dusun.',
  },
  {
    judul: 'Sekretariat Desa',
    isi: 'Mengelola administrasi, surat-menyurat, dan dokumentasi kegiatan pemerintahan desa.',
  },
  {
    judul: 'Pelayanan Masyarakat',
    isi: 'Menangani pengajuan surat, informasi data kependudukan, dan kebutuhan layanan harian warga.',
  },
  {
    judul: 'BPD dan Kelembagaan',
    isi: 'Menjaga fungsi musyawarah, pengawasan, dan kolaborasi bersama lembaga masyarakat desa.',
  },
]

export const pendidikanProgram = [
  {
    tanggal: 'Program 1',
    judul: 'Pendampingan belajar untuk anak usia sekolah',
    deskripsi:
      'Desa mendorong ruang belajar bersama agar anak-anak mendapat dukungan literasi dan numerasi dasar di lingkungan yang dekat.',
  },
  {
    tanggal: 'Program 2',
    judul: 'Koordinasi dengan sekolah dan orang tua',
    deskripsi:
      'Pemerintah desa ikut memfasilitasi komunikasi antara keluarga, sekolah, dan tokoh masyarakat untuk menjaga keberlanjutan pendidikan.',
  },
  {
    tanggal: 'Program 3',
    judul: 'Dukungan beasiswa dan perlengkapan sekolah',
    deskripsi:
      'Warga yang membutuhkan diarahkan ke pendataan bantuan pendidikan agar akses belajar lebih merata.',
  },
]

export const profilHighlight = [
  {
    angka: '01',
    label: 'Gotong royong menjadi dasar kerja warga dan pemerintah desa.',
  },
  {
    angka: '02',
    label: 'Pelayanan publik diarahkan agar lebih cepat, ramah, dan tertib.',
  },
  {
    angka: '03',
    label: 'Pembangunan desa dijalankan dengan musyawarah dan keterbukaan.',
  },
]

export const contactInfo = [
  'Senin - Jumat: 08.00 - 15.00 WIB',
  'surat@galihlunik.desa.id',
  '+62 811-2345-6789',
]

export function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '')

  if (cleanPath === '') {
    return '/'
  }

  return navItems.some((item) => item.path === cleanPath) ? cleanPath : '/'
}