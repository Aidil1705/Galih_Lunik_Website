import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  GraduationCap,
  ImagePlus,
  Landmark,
  LogOut,
  Newspaper,
  Save,
  Trash2,
  UploadCloud,
  Users,
} from 'lucide-react'
import { Card } from '../components/Card'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const emptyProfileState = {
  id: null,
  name: '',
  tagline: '',
  history: '',
  vision: '',
  mission: '',
  geography: '',
  areaSize: '',
  establishedYear: '',
  latitude: '',
  longitude: '',
  heroImageUrl: '',
  regionMapImageUrl: '',
  orgChartImageUrl: '',
  heroFile: null,
  regionMapFile: null,
  orgChartFile: null,
  address: '',
  phone: '',
  email: '',
  hours: '',
  contactNote: '',
}

const emptyNewsForm = {
  id: null,
  title: '',
  slug: '',
  content: '',
  category: '',
  coverImageUrl: '',
  coverFile: null,
  isPublished: true,
}

const emptyGalleryForm = {
  id: null,
  title: '',
  imageUrl: '',
  category: '',
  description: '',
  file: null,
}

const emptyPotentialForm = {
  id: null,
  name: '',
  category: 'wisata',
  description: '',
  coverImageUrl: '',
  coverFile: null,
  location: '',
}

const emptyInstitutionForm = {
  id: null,
  name: '',
  description: '',
  logoUrl: '',
  logoFile: null,
  headName: '',
}

const emptyServiceScheduleForm = {
  id: null,
  dayOfWeek: 'Senin',
  openTime: '',
  closeTime: '',
  note: '',
}

const emptyDemographicForm = {
  id: null,
  year: new Date().getFullYear(),
  category: 'usia',
  label: '',
  value: '',
}

const emptyEducationForm = {
  id: null,
  name: '',
  type: 'sd',
  address: '',
  studentCount: '',
  photoUrl: '',
  description: '',
  file: null,
}

function formatTimestamp(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('id-ID')
}

function thisIsRlsMessage(error, tableName) {
  const message = error?.message || ''
  if (message.toLowerCase().includes('row-level security') || message.toLowerCase().includes('rls')) {
    return `Akses menulis ke tabel "${tableName}" diblokir oleh Row Level Security Supabase. Buka Supabase Dashboard → Authentication/SQL Editor, lalu atur policy insert/update/delete yang mengizinkan akses untuk anon/authenticated.`
  }
  return error?.message || 'Terjadi kesalahan saat menyimpan data.'
}

function thisIsRlsError(error, tableName) {
  return new Error(thisIsRlsMessage(error, tableName))
}

function getItemById(items, id) {
  return items.find((item) => item.id === id) ?? null
}

export function ManagementPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sessionReady, setSessionReady] = useState(false)

  const [profile, setProfile] = useState(emptyProfileState)
  const [newsForm, setNewsForm] = useState(emptyNewsForm)
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm)
  const [potentialForm, setPotentialForm] = useState(emptyPotentialForm)
  const [institutionForm, setInstitutionForm] = useState(emptyInstitutionForm)
  const [serviceScheduleForm, setServiceScheduleForm] = useState(emptyServiceScheduleForm)
  const [demographicForm, setDemographicForm] = useState(emptyDemographicForm)
  const [educationForm, setEducationForm] = useState(emptyEducationForm)

  const [newsItems, setNewsItems] = useState([])
  const [galleryItems, setGalleryItems] = useState([])
  const [potentialItems, setPotentialItems] = useState([])
  const [institutionItems, setInstitutionItems] = useState([])
  const [serviceScheduleItems, setServiceScheduleItems] = useState([])
  const [demographicItems, setDemographicItems] = useState([])
  const [educationItems, setEducationItems] = useState([])

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

      const [profileResult, newsResult, galleryResult, potentialsResult, institutionsResult, schedulesResult, demographicsResult, educationResult] = await Promise.all([
        supabase.from('village_profile').select('*').order('updated_at', { ascending: false }).limit(10),
        supabase.from('news').select('*').order('published_at', { ascending: false }).limit(10),
        supabase.from('gallery').select('*').order('uploaded_at', { ascending: false }).limit(10),
        supabase.from('village_potentials').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('institutions').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('service_schedules').select('*').order('id', { ascending: true }).limit(10),
        supabase.from('demographics').select('*').order('year', { ascending: false }).limit(20),
        supabase.from('education_facilities').select('*').order('created_at', { ascending: false }).limit(10),
      ])

      if (!mounted) {
        return
      }

      if (profileResult.error) {
        setError((current) => (current ? `${current}\n${profileResult.error.message}` : profileResult.error.message))
      } else if (Array.isArray(profileResult.data) && profileResult.data[0]) {
        const firstProfile = profileResult.data[0]
        setProfile({
          id: firstProfile.id ?? null,
          name: firstProfile.name ?? firstProfile.village_name ?? '',
          tagline: firstProfile.tagline ?? '',
          history: firstProfile.history ?? '',
          vision: firstProfile.vision ?? '',
          mission: firstProfile.mission ?? '',
          geography: firstProfile.geography ?? '',
          areaSize: firstProfile.area_size ?? '',
          establishedYear: firstProfile.established_year ?? '',
          latitude: firstProfile.latitude ?? '',
          longitude: firstProfile.longitude ?? '',
          heroImageUrl: firstProfile.hero_image_url ?? '',
          regionMapImageUrl: firstProfile.region_map_image_url ?? '',
          orgChartImageUrl: firstProfile.org_chart_image_url ?? '',
          address: firstProfile.address ?? firstProfile.alamat ?? '',
          phone: firstProfile.phone ?? '',
          email: firstProfile.email ?? '',
          hours: firstProfile.operating_hours ?? '',
          contactNote: firstProfile.contact_note ?? '',
        })
      }

      if (!newsResult.error) {
        setNewsItems(Array.isArray(newsResult.data) ? newsResult.data : [])
      }

      if (!galleryResult.error) {
        setGalleryItems(Array.isArray(galleryResult.data) ? galleryResult.data : [])
      }

      if (!potentialsResult.error) {
        setPotentialItems(Array.isArray(potentialsResult.data) ? potentialsResult.data : [])
      }

      if (!institutionsResult.error) {
        setInstitutionItems(Array.isArray(institutionsResult.data) ? institutionsResult.data : [])
      }

      if (!schedulesResult.error) {
        setServiceScheduleItems(Array.isArray(schedulesResult.data) ? schedulesResult.data : [])
      }

      if (!demographicsResult.error) {
        setDemographicItems(Array.isArray(demographicsResult.data) ? demographicsResult.data : [])
      }

      if (!educationResult.error) {
        setEducationItems(Array.isArray(educationResult.data) ? educationResult.data : [])
      }

      setLoading(false)
    }

    load()

    const { data: listener } = supabase?.auth?.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return
      }
      if (!session) {
        setSessionReady(false)
      } else {
        setSessionReady(true)
      }
    }) ?? { data: null }

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  const heroSummary = useMemo(() => {
    return [
      { label: 'Status sesi', value: sessionReady ? 'Aktif' : 'Belum masuk' },
      { label: 'Data terkelola', value: `${newsItems.length + galleryItems.length + potentialItems.length + institutionItems.length + serviceScheduleItems.length + demographicItems.length + educationItems.length}` },
    ]
  }, [educationItems.length, galleryItems.length, institutionItems.length, newsItems.length, potentialItems.length, serviceScheduleItems.length, sessionReady, demographicItems.length])

  const handleSaveProfile = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase belum tersedia.')
      setSaving(false)
      return
    }

    try {
      const heroImageUrl = profile.heroFile ? await uploadFileToStorage(profile.heroFile, storageBucketName) : profile.heroImageUrl || null
      const regionMapImageUrl = profile.regionMapFile ? await uploadFileToStorage(profile.regionMapFile, storageBucketName) : profile.regionMapImageUrl || null
      const orgChartImageUrl = profile.orgChartFile ? await uploadFileToStorage(profile.orgChartFile, storageBucketName) : profile.orgChartImageUrl || null

      const payload = {
        name: profile.name,
        tagline: profile.tagline,
        history: profile.history,
        vision: profile.vision,
        mission: profile.mission,
        geography: profile.geography,
        area_size: profile.areaSize || null,
        established_year: profile.establishedYear || null,
        latitude: profile.latitude || null,
        longitude: profile.longitude || null,
        hero_image_url: heroImageUrl,
        region_map_image_url: regionMapImageUrl,
        org_chart_image_url: orgChartImageUrl,
        alamat: profile.address,
        phone: profile.phone,
        email: profile.email,
        operating_hours: profile.hours,
        contact_note: profile.contactNote,
      }

      if (profile.id) {
        const { error: updateError } = await supabase.from('village_profile').update(payload).eq('id', profile.id)
        if (updateError) {
          throw updateError
        }
      } else {
        const { data, error: insertError } = await supabase.from('village_profile').insert(payload).select().single()
        if (insertError) {
          throw thisIsRlsError(insertError, 'village_profile')
        }
        setProfile((current) => ({ ...current, id: data?.id ?? null }))
      }

      setProfile((current) => ({ ...current, heroImageUrl: heroImageUrl || current.heroImageUrl, regionMapImageUrl: regionMapImageUrl || current.regionMapImageUrl, orgChartImageUrl: orgChartImageUrl || current.orgChartImageUrl, heroFile: null, regionMapFile: null, orgChartFile: null }))
      setMessage('Profil desa berhasil disimpan.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNews = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const coverImageUrl = newsForm.coverFile ? await uploadFileToStorage(newsForm.coverFile, storageBucketName) : newsForm.coverImageUrl || null

const existingNews = getItemById(newsItems, newsForm.id)
    const payload = {
      title: newsForm.title || existingNews?.title || '',
      slug: newsForm.slug || existingNews?.slug || newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      content: newsForm.content || existingNews?.content || '',
      category: newsForm.category || existingNews?.category || '',
      cover_image_url: coverImageUrl || existingNews?.cover_image_url || null,
      is_published: typeof newsForm.isPublished === 'boolean' ? newsForm.isPublished : existingNews?.is_published ?? true,
      published_at: existingNews?.published_at || new Date().toISOString(),
      }

      if (newsForm.id) {
        const { error: updateError } = await supabase.from('news').update(payload).eq('id', newsForm.id)
        if (updateError) {
          throw thisIsRlsError(updateError, 'news')
        }
      } else {
        const { error: insertError } = await supabase.from('news').insert(payload)
        if (insertError) {
          throw thisIsRlsError(insertError, 'news')
        }
      }

      setNewsForm(emptyNewsForm)
      setMessage('Berita berhasil disimpan.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteNews = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('news').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setNewsItems((current) => current.filter((item) => item.id !== id))
    setMessage('Berita berhasil dihapus.')
  }

  const storageBucketName = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'gambar'

  const uploadFileToStorage = async (file, bucket = storageBucketName) => {
    if (!file) {
      return ''
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase belum terhubung, jadi file tidak bisa diupload ke storage.')
    }

    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (error) {
        const message = error.message || ''
        if (message.toLowerCase().includes('bucket') && message.toLowerCase().includes('not found')) {
          return ''
        }
        throw error
      }

      return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl
    } catch (error) {
      return ''
    }
  }

  const handleSaveGallery = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const imageUrl = galleryForm.file ? await uploadFileToStorage(galleryForm.file, storageBucketName) : galleryForm.imageUrl

      const existingGallery = getItemById(galleryItems, galleryForm.id)
      const payload = {
        title: galleryForm.title || existingGallery?.title || '',
        image_url: imageUrl || existingGallery?.image_url || '',
        category: galleryForm.category || existingGallery?.category || '',
        description: galleryForm.description || existingGallery?.description || '',
        uploaded_at: existingGallery?.uploaded_at || new Date().toISOString(),
      }

      if (galleryForm.id) {
        const { error: updateError } = await supabase.from('gallery').update(payload).eq('id', galleryForm.id)
        if (updateError) {
          throw thisIsRlsError(updateError, 'gallery')
        }
      } else {
        const { error: insertError } = await supabase.from('gallery').insert(payload)
        if (insertError) {
          throw thisIsRlsError(insertError, 'gallery')
        }
      }

      setGalleryForm(emptyGalleryForm)
      setMessage('Galeri berhasil disimpan.')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGallery = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('gallery').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setGalleryItems((current) => current.filter((item) => item.id !== id))
    setMessage('Foto galeri berhasil dihapus.')
  }

  const handleSavePotential = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const coverImageUrl = potentialForm.coverFile ? await uploadFileToStorage(potentialForm.coverFile, storageBucketName) : potentialForm.coverImageUrl || null

      const existingPotential = getItemById(potentialItems, potentialForm.id)
      const payload = {
        name: potentialForm.name || existingPotential?.name || '',
        category: potentialForm.category || existingPotential?.category || 'wisata',
        description: potentialForm.description || existingPotential?.description || '',
        cover_image_url: coverImageUrl || existingPotential?.cover_image_url || null,
        location: potentialForm.location || existingPotential?.location || '',
      }

      if (potentialForm.id) {
        const { error: updateError } = await supabase.from('village_potentials').update(payload).eq('id', potentialForm.id)
        if (updateError) {
          throw thisIsRlsError(updateError, 'village_potentials')
        }
      } else {
        const { error: insertError } = await supabase.from('village_potentials').insert(payload)
        if (insertError) {
          throw thisIsRlsError(insertError, 'village_potentials')
        }
      }

      setPotentialForm(emptyPotentialForm)
      setMessage('Potensi desa berhasil disimpan.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePotential = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('village_potentials').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setPotentialItems((current) => current.filter((item) => item.id !== id))
    setMessage('Potensi desa berhasil dihapus.')
  }

  const handleSaveInstitution = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const logoUrl = institutionForm.logoFile ? await uploadFileToStorage(institutionForm.logoFile, storageBucketName) : institutionForm.logoUrl || null

      const existingInstitution = getItemById(institutionItems, institutionForm.id)
      const payload = {
        name: institutionForm.name || existingInstitution?.name || '',
        description: institutionForm.description || existingInstitution?.description || '',
        logo_url: logoUrl || existingInstitution?.logo_url || null,
        head_name: institutionForm.headName || existingInstitution?.head_name || '',
      }

      if (institutionForm.id) {
        const { error: updateError } = await supabase.from('institutions').update(payload).eq('id', institutionForm.id)
        if (updateError) {
          throw thisIsRlsError(updateError, 'institutions')
        }
      } else {
        const { error: insertError } = await supabase.from('institutions').insert(payload)
        if (insertError) {
          throw thisIsRlsError(insertError, 'institutions')
        }
      }

      setInstitutionForm(emptyInstitutionForm)
      setMessage('Lembaga berhasil disimpan.')
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteInstitution = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('institutions').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setInstitutionItems((current) => current.filter((item) => item.id !== id))
    setMessage('Lembaga berhasil dihapus.')
  }

  const handleSaveServiceSchedule = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const existingSchedule = getItemById(serviceScheduleItems, serviceScheduleForm.id)
    const payload = {
      day_of_week: serviceScheduleForm.dayOfWeek || existingSchedule?.day_of_week || '',
      open_time: serviceScheduleForm.openTime || existingSchedule?.open_time || null,
      close_time: serviceScheduleForm.closeTime || existingSchedule?.close_time || null,
      note: serviceScheduleForm.note || existingSchedule?.note || '',
    }

    if (serviceScheduleForm.id) {
      const { error: updateError } = await supabase.from('service_schedules').update(payload).eq('id', serviceScheduleForm.id)
      if (updateError) {
        setError(thisIsRlsMessage(updateError, 'service_schedules'))
        setSaving(false)
        return
      }
    } else {
      const { error: insertError } = await supabase.from('service_schedules').insert(payload)
      if (insertError) {
        setError(thisIsRlsMessage(insertError, 'service_schedules'))
        setSaving(false)
        return
      }
    }

    setServiceScheduleForm(emptyServiceScheduleForm)
    setMessage('Jadwal layanan berhasil disimpan.')
    setSaving(false)
  }

  const handleDeleteServiceSchedule = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('service_schedules').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setServiceScheduleItems((current) => current.filter((item) => item.id !== id))
    setMessage('Jadwal layanan berhasil dihapus.')
  }

  const handleSaveDemographic = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const existingDemographic = getItemById(demographicItems, demographicForm.id)
    const payload = {
      year: Number(demographicForm.year || existingDemographic?.year || new Date().getFullYear()),
      category: demographicForm.category || existingDemographic?.category || 'usia',
      label: demographicForm.label || existingDemographic?.label || '',
      value: Number(demographicForm.value ?? existingDemographic?.value ?? 0),
    }

    if (demographicForm.id) {
      const { error: updateError } = await supabase.from('demographics').update(payload).eq('id', demographicForm.id)
      if (updateError) {
        setError(thisIsRlsMessage(updateError, 'demographics'))
        setSaving(false)
        return
      }
    } else {
      const { error: insertError } = await supabase.from('demographics').insert(payload)
      if (insertError) {
        setError(thisIsRlsMessage(insertError, 'demographics'))
        setSaving(false)
        return
      }
    }

    setDemographicForm(emptyDemographicForm)
    setMessage('Data demografi berhasil disimpan.')
    setSaving(false)
  }

  const handleDeleteDemographic = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('demographics').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setDemographicItems((current) => current.filter((item) => item.id !== id))
    setMessage('Data demografi berhasil dihapus.')
  }

  const handleSaveEducation = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const photoUrl = educationForm.file ? await uploadFileToStorage(educationForm.file, storageBucketName) : educationForm.photoUrl

      const existingEducation = getItemById(educationItems, educationForm.id)
      const payload = {
        name: educationForm.name || existingEducation?.name || '',
        type: educationForm.type || existingEducation?.type || 'sd',
        address: educationForm.address || existingEducation?.address || '',
        student_count: Number(educationForm.studentCount ?? existingEducation?.student_count ?? 0) || null,
        photo_url: photoUrl || existingEducation?.photo_url || null,
        description: educationForm.description || existingEducation?.description || '',
      }

      if (educationForm.id) {
        const { error: updateError } = await supabase.from('education_facilities').update(payload).eq('id', educationForm.id)
        if (updateError) {
          throw thisIsRlsError(updateError, 'education_facilities')
        }
      } else {
        const { error: insertError } = await supabase.from('education_facilities').insert(payload)
        if (insertError) {
          throw thisIsRlsError(insertError, 'education_facilities')
        }
      }

      setEducationForm(emptyEducationForm)
      setMessage('Fasilitas pendidikan berhasil disimpan.')
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteEducation = async (id) => {
    if (!id) {
      return
    }

    const { error: deleteError } = await supabase.from('education_facilities').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setEducationItems((current) => current.filter((item) => item.id !== id))
    setMessage('Fasilitas pendidikan berhasil dihapus.')
  }

  const logout = async () => {
    if (!supabase) {
      return
    }
    await supabase.auth.signOut()
  }

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
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola data desa</h1>
            <p className="mt-2 text-sm text-slate-600">Kelola profil, berita, galeri, potensi, lembaga, jadwal layanan, data demografi, dan fasilitas pendidikan dari satu panel.</p>
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
          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Profil desa</h2>
              </div>
              <form onSubmit={handleSaveProfile} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Desa</label>
                    <input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tagline</label>
                    <input value={profile.tagline} onChange={(event) => setProfile((current) => ({ ...current, tagline: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Sejarah</label>
                  <textarea value={profile.history} onChange={(event) => setProfile((current) => ({ ...current, history: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Visi</label>
                    <textarea value={profile.vision} onChange={(event) => setProfile((current) => ({ ...current, vision: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Misi</label>
                    <textarea value={profile.mission} onChange={(event) => setProfile((current) => ({ ...current, mission: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Geografi</label>
                    <input value={profile.geography} onChange={(event) => setProfile((current) => ({ ...current, geography: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Luas Wilayah</label>
                    <input value={profile.areaSize} onChange={(event) => setProfile((current) => ({ ...current, areaSize: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tahun Berdiri</label>
                    <input value={profile.establishedYear} onChange={(event) => setProfile((current) => ({ ...current, establishedYear: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Koordinat</label>
                    <input value={`${profile.latitude ?? ''}, ${profile.longitude ?? ''}`} onChange={() => undefined} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Gambar Hero</label>
                    <input type="file" accept="image/*" onChange={(event) => setProfile((current) => ({ ...current, heroFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                    {profile.heroImageUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {profile.heroImageUrl}</p> : null}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Peta Wilayah</label>
                    <input type="file" accept="image/*" onChange={(event) => setProfile((current) => ({ ...current, regionMapFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                    {profile.regionMapImageUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {profile.regionMapImageUrl}</p> : null}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Bagan Struktur Organisasi</label>
                  <input type="file" accept="image/*" onChange={(event) => setProfile((current) => ({ ...current, orgChartFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                  {profile.orgChartImageUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {profile.orgChartImageUrl}</p> : null}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Alamat</label>
                    <input value={profile.address} onChange={(event) => setProfile((current) => ({ ...current, address: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Telepon</label>
                    <input value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                    <input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Jam Layanan</label>
                    <input value={profile.hours} onChange={(event) => setProfile((current) => ({ ...current, hours: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Catatan Kontak</label>
                  <textarea value={profile.contactNote} onChange={(event) => setProfile((current) => ({ ...current, contactNote: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
                {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan profil'}
                </button>
              </form>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <BookOpenText className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Berita dan pengumuman</h2>
              </div>
              <form onSubmit={handleSaveNews} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Judul</label>
                    <input value={newsForm.title} onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
                    <input value={newsForm.slug} onChange={(event) => setNewsForm((current) => ({ ...current, slug: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
                    <input value={newsForm.category} onChange={(event) => setNewsForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Cover</label>
                    <input type="file" accept="image/*" onChange={(event) => setNewsForm((current) => ({ ...current, coverFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                    {newsForm.coverImageUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {newsForm.coverImageUrl}</p> : null}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Isi</label>
                  <textarea value={newsForm.content} onChange={(event) => setNewsForm((current) => ({ ...current, content: event.target.value }))} rows="4" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={newsForm.isPublished} onChange={(event) => setNewsForm((current) => ({ ...current, isPublished: event.target.checked }))} />
                  Tampilkan publik
                </label>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan berita'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {newsItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm text-slate-600">{item.category || 'Berita'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewsForm({ ...emptyNewsForm, id: item.id, title: item.title, slug: item.slug || '', content: item.content || '', category: item.category || '', coverImageUrl: item.cover_image_url || '', isPublished: item.is_published ?? true })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteNews(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <ImagePlus className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Galeri foto</h2>
              </div>
              <form onSubmit={handleSaveGallery} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Judul</label>
                  <input value={galleryForm.title} onChange={(event) => setGalleryForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
                    <input value={galleryForm.category} onChange={(event) => setGalleryForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">URL Gambar</label>
                    <input value={galleryForm.imageUrl} onChange={(event) => setGalleryForm((current) => ({ ...current, imageUrl: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
                  <textarea value={galleryForm.description} onChange={(event) => setGalleryForm((current) => ({ ...current, description: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">File gambar</label>
                  <input type="file" accept="image/*" onChange={(event) => setGalleryForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                  <UploadCloud className="h-4 w-4" />
                  {saving ? 'Mengunggah...' : 'Simpan galeri'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {galleryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title || 'Foto'}</p>
                      <p className="text-sm text-slate-600">{item.description || item.category || 'Galeri'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setGalleryForm({ ...emptyGalleryForm, id: item.id, title: item.title || '', imageUrl: item.image_url || '', category: item.category || '', description: item.description || '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteGallery(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Potensi desa</h2>
              </div>
              <form onSubmit={handleSavePotential} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
                    <input value={potentialForm.name} onChange={(event) => setPotentialForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
                    <select value={potentialForm.category} onChange={(event) => setPotentialForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm">
                      <option value="wisata">Wisata</option>
                      <option value="umkm">UMKM</option>
                      <option value="budaya">Budaya</option>
                      <option value="pertanian">Pertanian</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
                  <textarea value={potentialForm.description} onChange={(event) => setPotentialForm((current) => ({ ...current, description: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Lokasi</label>
                    <input value={potentialForm.location} onChange={(event) => setPotentialForm((current) => ({ ...current, location: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Cover</label>
                    <input type="file" accept="image/*" onChange={(event) => setPotentialForm((current) => ({ ...current, coverFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                    {potentialForm.coverImageUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {potentialForm.coverImageUrl}</p> : null}
                  </div>
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan potensi'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {potentialItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.location || item.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setPotentialForm({ ...emptyPotentialForm, id: item.id, name: item.name || '', category: item.category || 'wisata', description: item.description || '', location: item.location || '', coverImageUrl: item.cover_image_url || '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeletePotential(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Lembaga desa</h2>
              </div>
              <form onSubmit={handleSaveInstitution} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Lembaga</label>
                    <input value={institutionForm.name} onChange={(event) => setInstitutionForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kepala</label>
                    <input value={institutionForm.headName} onChange={(event) => setInstitutionForm((current) => ({ ...current, headName: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
                  <textarea value={institutionForm.description} onChange={(event) => setInstitutionForm((current) => ({ ...current, description: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Unggah Logo</label>
                  <input type="file" accept="image/*" onChange={(event) => setInstitutionForm((current) => ({ ...current, logoFile: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                  {institutionForm.logoUrl ? <p className="mt-2 text-xs text-slate-500">URL saat ini: {institutionForm.logoUrl}</p> : null}
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan lembaga'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {institutionItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.head_name || 'Lembaga'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setInstitutionForm({ ...emptyInstitutionForm, id: item.id, name: item.name || '', description: item.description || '', logoUrl: item.logo_url || '', headName: item.head_name || '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteInstitution(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Jadwal pelayanan</h2>
              </div>
              <form onSubmit={handleSaveServiceSchedule} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Hari</label>
                    <input value={serviceScheduleForm.dayOfWeek} onChange={(event) => setServiceScheduleForm((current) => ({ ...current, dayOfWeek: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Catatan</label>
                    <input value={serviceScheduleForm.note} onChange={(event) => setServiceScheduleForm((current) => ({ ...current, note: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Jam Buka</label>
                    <input value={serviceScheduleForm.openTime} onChange={(event) => setServiceScheduleForm((current) => ({ ...current, openTime: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Jam Tutup</label>
                    <input value={serviceScheduleForm.closeTime} onChange={(event) => setServiceScheduleForm((current) => ({ ...current, closeTime: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan jadwal'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {serviceScheduleItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.day_of_week}</p>
                      <p className="text-sm text-slate-600">{item.note || `${item.open_time || '-'} - ${item.close_time || '-'}`}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setServiceScheduleForm({ ...emptyServiceScheduleForm, id: item.id, dayOfWeek: item.day_of_week || '', openTime: item.open_time || '', closeTime: item.close_time || '', note: item.note || '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteServiceSchedule(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Data demografi</h2>
              </div>
              <form onSubmit={handleSaveDemographic} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Tahun</label>
                    <input type="number" value={demographicForm.year} onChange={(event) => setDemographicForm((current) => ({ ...current, year: Number(event.target.value) }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
                    <select value={demographicForm.category} onChange={(event) => setDemographicForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm">
                      <option value="usia">Usia</option>
                      <option value="jenis_kelamin">Jenis Kelamin</option>
                      <option value="pendidikan">Pendidikan</option>
                      <option value="pekerjaan">Pekerjaan</option>
                      <option value="agama">Agama</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Label</label>
                    <input value={demographicForm.label} onChange={(event) => setDemographicForm((current) => ({ ...current, label: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nilai</label>
                    <input type="number" value={demographicForm.value} onChange={(event) => setDemographicForm((current) => ({ ...current, value: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan data'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {demographicItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-600">{item.category} • {item.year}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setDemographicForm({ ...emptyDemographicForm, id: item.id, year: item.year || new Date().getFullYear(), category: item.category || 'usia', label: item.label || '', value: item.value ?? '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteDemographic(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Fasilitas pendidikan</h2>
              </div>
              <form onSubmit={handleSaveEducation} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
                    <input value={educationForm.name} onChange={(event) => setEducationForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Jenis</label>
                    <select value={educationForm.type} onChange={(event) => setEducationForm((current) => ({ ...current, type: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm">
                      <option value="paud">PAUD</option>
                      <option value="tk">TK</option>
                      <option value="sd">SD</option>
                      <option value="smp">SMP</option>
                      <option value="sma">SMA</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Alamat</label>
                    <input value={educationForm.address} onChange={(event) => setEducationForm((current) => ({ ...current, address: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Jumlah Siswa</label>
                    <input type="number" value={educationForm.studentCount} onChange={(event) => setEducationForm((current) => ({ ...current, studentCount: event.target.value }))} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Deskripsi</label>
                  <textarea value={educationForm.description} onChange={(event) => setEducationForm((current) => ({ ...current, description: event.target.value }))} rows="3" className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Foto</label>
                  <input type="file" accept="image/*" onChange={(event) => setEducationForm((current) => ({ ...current, file: event.target.files?.[0] ?? null }))} className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm" />
                </div>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan fasilitas'}
                </button>
              </form>
              <div className="mt-5 space-y-2">
                {educationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.address || item.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setEducationForm({ ...emptyEducationForm, id: item.id, name: item.name || '', type: item.type || 'sd', address: item.address || '', studentCount: item.student_count ?? '', photoUrl: item.photo_url || '', description: item.description || '' })} className="rounded-full border border-emerald-200 p-2 text-emerald-700">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDeleteEducation(item.id)} className="rounded-full border border-rose-200 p-2 text-rose-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
