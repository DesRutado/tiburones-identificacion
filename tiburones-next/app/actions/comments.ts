'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type Comment = {
  id: number
  article_slug: string
  name: string
  comment: string
  created_at: string
  approved: boolean
  parent_id: number | null
}

export type CommentState = {
  success: boolean
  error: string
}

export async function getComments(slug: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_slug', slug)
    .eq('approved', true)
    .order('created_at', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function submitComment(
  _prevState: CommentState | null,
  formData: FormData
): Promise<CommentState> {
  const name = (formData.get('name') as string)?.trim()
  const comment = (formData.get('comment') as string)?.trim()
  const slug = formData.get('slug') as string

  if (!name || !comment || !slug) {
    return { success: false, error: 'Todos los campos son obligatorios.' }
  }
  if (name.length > 100) {
    return { success: false, error: 'El nombre es demasiado largo (máx. 100 caracteres).' }
  }
  if (comment.length > 2000) {
    return { success: false, error: 'El comentario es demasiado largo (máx. 2000 caracteres).' }
  }

  const { error } = await supabase.from('comments').insert({ article_slug: slug, name, comment })

  if (error) return { success: false, error: 'Error al guardar el comentario. Inténtalo de nuevo.' }

  revalidatePath(`/blog/${slug}`)
  return { success: true, error: '' }
}

export async function submitReply(
  _prevState: CommentState | null,
  formData: FormData
): Promise<CommentState> {
  const name = (formData.get('name') as string)?.trim()
  const comment = (formData.get('comment') as string)?.trim()
  const slug = formData.get('slug') as string
  const parentId = parseInt(formData.get('parent_id') as string)

  if (!name || !comment || !slug || !parentId) {
    return { success: false, error: 'Todos los campos son obligatorios.' }
  }
  if (name.length > 100) {
    return { success: false, error: 'El nombre es demasiado largo (máx. 100 caracteres).' }
  }
  if (comment.length > 1000) {
    return { success: false, error: 'La respuesta es demasiado larga (máx. 1000 caracteres).' }
  }

  const { error } = await supabase
    .from('comments')
    .insert({ article_slug: slug, name, comment, parent_id: parentId })

  if (error) return { success: false, error: 'Error al guardar la respuesta. Inténtalo de nuevo.' }

  revalidatePath(`/blog/${slug}`)
  return { success: true, error: '' }
}
