'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import type { Comment } from './comments'

export async function getPendingComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function approveComment(adminKey: string, formData: FormData) {
  if (!process.env.ADMIN_SECRET || adminKey !== process.env.ADMIN_SECRET) return
  const id = parseInt(formData.get('comment_id') as string)
  await supabase.from('comments').update({ approved: true }).eq('id', id)
  revalidatePath('/admin')
}

export async function rejectComment(adminKey: string, formData: FormData) {
  if (!process.env.ADMIN_SECRET || adminKey !== process.env.ADMIN_SECRET) return
  const id = parseInt(formData.get('comment_id') as string)
  await supabase.from('comments').delete().eq('id', id)
  revalidatePath('/admin')
}
