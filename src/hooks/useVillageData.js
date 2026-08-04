import { useQuery } from '@tanstack/react-query'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import {
  normalizeDemographic,
  normalizeEducationFacility,
  normalizeGalleryItem,
  normalizeInstitution,
  normalizeNews,
  normalizePotential,
  normalizeServiceSchedule,
  normalizeVillageProfile,
} from '../lib/normalizers'
import { sortRowsByDate, sortRowsByYear } from '../lib/dataHelpers'

async function fetchTableRows(tableName) {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase.from(tableName).select('*')

  if (error) {
    throw error
  }

  return Array.isArray(data) ? data : []
}

function useTableRows(tableName, options = {}) {
  return useQuery({
    queryKey: [tableName],
    queryFn: () => fetchTableRows(tableName),
    enabled: (options.enabled ?? true) && isSupabaseConfigured,
    initialData: options.initialData ?? [],
    select: options.select,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export function useVillageProfile() {
  return useQuery({
    queryKey: ['village_profile'],
    queryFn: async () => {
      const rows = await fetchTableRows('village_profile')
      return normalizeVillageProfile(rows[0] ?? {})
    },
    enabled: isSupabaseConfigured,
    initialData: null,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}

export function useNews() {
  return useTableRows('news', {
    initialData: [],
    select: (rows) =>
      sortRowsByDate(rows)
        .map(normalizeNews)
        .filter((item) => item.isPublished !== false),
  })
}

export function useGallery() {
  return useTableRows('gallery', {
    initialData: [],
    select: (rows) => sortRowsByDate(rows).map(normalizeGalleryItem),
  })
}

export function useVillagePotentials() {
  return useTableRows('village_potentials', {
    initialData: [],
    select: (rows) => sortRowsByDate(rows).map(normalizePotential),
  })
}

export function useInstitutions() {
  return useTableRows('institutions', {
    initialData: [],
    select: (rows) => sortRowsByDate(rows).map(normalizeInstitution),
  })
}

export function useServiceSchedules() {
  return useTableRows('service_schedules', {
    initialData: [],
    select: (rows) =>
      [...rows].sort((left, right) => {
        const leftOrder = Number(left.day_order ?? left.sort_order ?? 99)
        const rightOrder = Number(right.day_order ?? right.sort_order ?? 99)
        return leftOrder - rightOrder
      }).map(normalizeServiceSchedule),
  })
}

export function useDemographics() {
  return useTableRows('demographics', {
    initialData: [],
    select: (rows) => sortRowsByYear(rows).map(normalizeDemographic),
  })
}

export function useEducationFacilities() {
  return useTableRows('education_facilities', {
    initialData: [],
    select: (rows) => sortRowsByDate(rows).map(normalizeEducationFacility),
  })
}