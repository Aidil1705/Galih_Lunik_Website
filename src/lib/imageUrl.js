import { supabase } from './supabaseClient'

export function resolveImageUrl(record, options = {}) {
  const urlFields = options.urlFields ?? []
  const pathFields = options.pathFields ?? []
  const bucketFields = options.bucketFields ?? []

  for (const field of urlFields) {
    const value = record?.[field]

    if (value) {
      return String(value)
    }
  }

  if (!supabase) {
    return ''
  }

  const bucket = bucketFields
    .map((field) => record?.[field])
    .find((value) => value !== undefined && value !== null && String(value).trim() !== '')

  if (!bucket) {
    return ''
  }

  for (const field of pathFields) {
    const path = record?.[field]

    if (path) {
      return supabase.storage.from(String(bucket)).getPublicUrl(String(path)).data.publicUrl
    }
  }

  return ''
}