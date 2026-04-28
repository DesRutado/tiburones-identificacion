'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitComment, type Comment, type CommentState } from '@/app/actions/comments'

interface Props {
  slug: string
  initialComments: Comment[]
}

const initialState: CommentState = { success: false, error: '' }

export default function CommentSection({ slug, initialComments }: Props) {
  const [state, formAction, pending] = useActionState(submitComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <section className="comments-section">
      <div className="comments-header">
        <span className="comments-label">Comentarios</span>
        {initialComments.length > 0 && (
          <span className="comments-count">{initialComments.length}</span>
        )}
      </div>

      <form ref={formRef} action={formAction} className="comments-form">
        <input type="hidden" name="slug" value={slug} />

        <div className="comments-field">
          <label htmlFor="comment-name" className="comments-field-label">Nombre</label>
          <input
            id="comment-name"
            name="name"
            type="text"
            required
            maxLength={100}
            className="comments-input"
            placeholder="Tu nombre"
          />
        </div>

        <div className="comments-field">
          <label htmlFor="comment-body" className="comments-field-label">Comentario</label>
          <textarea
            id="comment-body"
            name="comment"
            required
            maxLength={2000}
            rows={4}
            className="comments-textarea"
            placeholder="Comparte tu opinión sobre este artículo..."
          />
        </div>

        {state.error && <p className="comments-error">{state.error}</p>}
        {state.success && <p className="comments-success">¡Comentario publicado!</p>}

        <button type="submit" disabled={pending} className="comments-submit">
          {pending ? 'Enviando...' : 'Publicar comentario'}
        </button>
      </form>

      {initialComments.length > 0 ? (
        <div className="comments-list">
          {initialComments.map((c) => (
            <article key={c.id} className="comment-item">
              <div className="comment-meta">
                <span className="comment-name">{c.name}</span>
                <time className="comment-date">{formatDate(c.created_at)}</time>
              </div>
              <p className="comment-body">{c.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="comments-empty">Sé el primero en comentar.</p>
      )}
    </section>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
