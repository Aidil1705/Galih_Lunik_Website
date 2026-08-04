import { useEffect, useMemo, useState } from 'react'
import { LogOut, ImagePlus, Newspaper, Save, UploadCloud } from 'lucide-react'
import { Card } from '../components/Card'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const initialProfileState = {
  villageName: '',
  tagline: '',
  history: '',
  headGreeting: '',
  vision: '',
  mission: '',
  address: '',
  phone: '',
  email: '',
  hours: '',
  contactNote: '',
}

export function ManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(initialProfileState)
  const [galleryTitle, setGalleryTitle] = useState('')
  const [galleryCaption, setGalleryCaption] = useState('')
  const [galleryFile, setGalleryFile] = useState(null)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setLoading(false)
          setError('Supabase belum dikonfigurasi.')
        }
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        if (mounted) {
          setLoading(false)
          setError('Sesi login tidak ditemukan. Silakan masuk kembali.')
        }
        return
      }

      if (mounted) {
        setSessionReady(true)
      }

      const { data, error: profileError } = await supabase.from('village_profile').select('*').limit(1).maybeSingle()
      if (mounted) {
        if (profileError) {
          setError(profileError.message)
        } else if (data) {
          setProfile({
            villageName: data.village_name ?? '',
            tagline: data.tagline ?? '',
            history: data.history ?? '',
            headGreeting: data.head_message ?? '',
            vision: data.vision ?? '',
            mission: data.mission ?? '',
            address: data.address ?? '',
            phone: data.phone ?? '',
            email: data.email ?? '',
            hours: data.operating_hours ?? '',
            contactNote: data.contact_note ?? '',
          })
        }
        setLoading(false)
      }
    }

    load()

    const { data: listener } = supabase?.auth?.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return
      }
      if (!session) {
        setSessionReady(false)
        setError('Sesi login berakhir.')
      } else {
        setSessionReady(true)
      }
    }) ?? { data: null }

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleFieldChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase belum tersedia.')
      setSaving(false)
      return
    }

    const payload = {
      village_name: profile.villageName,
      tagline: profile.tagline,
      history: profile.history,
      head_message: profile.headGreeting,
      vision: profile.vision,
      mission: profile.mission,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
      operating_hours: profile.hours,
      contact_note: profile.contactNote,
    }

    const { error: upsertError } = await supabase.from('village_profile').upsert(payload, { onConflict: 'id' })

    if (upsertError) {
      setError(upsertError.message)
      setSaving(false)
      return
    }

    setMessage('Informasi desa berhasil disimpan.')
    setSaving(false)
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!galleryFile) {
      setError('Pilih file foto terlebih dahulu.')
      return
    }

    setGalleryUploading(true)
    setMessage('')
    setError('')

    const fileName = `${Date.now()}-${galleryFile.name}`
    const { data: storageData, error: storageError } = await supabase.storage.from('gallery').upload(fileName, galleryFile, {
      cacheControl: '3600',
      upsert: false,
    })

    if (storageError) {
      setError(storageError.message)
      setGalleryUploading(false)
      return
    }

    const imageUrl = supabase.storage.from('gallery').getPublicUrl(storageData.path).data.publicUrl

    const { error: insertError } = await supabase.from('gallery').insert({
      title: galleryTitle || 'Foto baru',
      caption: galleryCaption,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      setError(insertError.message)
      setGalleryUploading(false)
      return
    }

    setGalleryTitle('')
    setGalleryCaption('')
    setGalleryFile(null)
    setMessage('Foto berhasil ditambahkan ke galeri.')
    setGalleryUploading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const heroSummary = useMemo(() => {
    return [
      { label: 'Status sesi', value: sessionReady ? 'Aktif' : 'Belum masuk' },
      { label: 'Mode edit', value: 'Profil + Galeri' },
    ]
  }, [sessionReady])

  if (loading) {
    return (
      <div className="min-h-[70vh] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-emerald-100 bg-white/90 p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">Memuat panel management…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-emerald-50 via-white to-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola informasi desa</h1>
            <p className="mt-2 text-sm text-slate-600">Perbarui profil desa dan tambahkan foto galeri dari panel admin.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-slate-900">Informasi desa</h2>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Desa</label>
                  <input value={profile.villageName} onChange={(event) => handleFieldChange('villageName', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Tagline</label>
                  <input value={profile.tagline} onChange={(event) => handleFieldChange('tagline', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Sejarah</label>
                <textarea value={profile.history} onChange={(event) => handleFieldChange('history', event.target.value)} rows="4" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Sambutan Kepala Desa</label>
                <textarea value={profile.headGreeting} onChange={(event) => handleFieldChange('headGreeting', event.target.value)} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Visi</label>
                  <textarea value={profile.vision} onChange={(event) => handleFieldChange('vision', event.target.value)} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Misi</label>
                  <textarea value={profile.mission} onChange={(event) => handleFieldChange('mission', event.target.value)} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Alamat</label>
                  <input value={profile.address} onChange={(event) => handleFieldChange('address', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Telepon</label>
                  <input value={profile.phone} onChange={(event) => handleFieldChange('phone', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <input value={profile.email} onChange={(event) => handleFieldChange('email', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Jam Layanan</label>
                  <input value={profile.hours} onChange={(event) => handleFieldChange('hours', event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Catatan Kontak</label>
                <textarea value={profile.contactNote} onChange={(event) => handleFieldChange('contactNote', event.target.value)} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
              </div>

              {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
              {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                <Save className="h-4 w-4" />
                {saving ? 'Menyimpan...' : 'Simpan perubahan'}
              </button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ImagePlus className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Tambah foto galeri</h2>
              </div>

              <form onSubmit={handleUpload} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Judul foto</label>
                  <input value={galleryTitle} onChange={(event) => setGalleryTitle(event.target.value)} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Keterangan</label>
                  <textarea value={galleryCaption} onChange={(event) => setGalleryCaption(event.target.value)} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">File gambar</label>
                  <input type="file" accept="image/*" onChange={(event) => setGalleryFile(event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                </div>

                <button type="submit" disabled={galleryUploading} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                  <UploadCloud className="h-4 w-4" />
                  {galleryUploading ? 'Mengunggah...' : 'Unggah ke galeri'}
                </button>
              </form>
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">Ringkasan akses</h2>
              <div className="mt-5 grid gap-3">
                {heroSummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
