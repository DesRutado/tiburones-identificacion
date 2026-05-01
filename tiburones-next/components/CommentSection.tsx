'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { submitComment, submitReply, type Comment, type CommentState } from '@/app/actions/comments'

interface Props {
  slug: string
  initialComments: Comment[]
}

const initialState: CommentState = { success: false, error: '' }

function ReplyForm({
  slug,
  parentId,
  onClose,
}: {
  slug: string
  parentId: number
  onClose: () => void
}) {
  const [state, formAction, pending] = useActionState(submitReply, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      onClose()
    }
  }, [state.success, onClose])

  return (
    <form ref={formRef} action={formAction} className="reply-form">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="parent_id" value={parentId} />

      <div className="comments-field">
        <label className="comments-field-label">Nombre</label>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          className="comments-input"
          placeholder="Tu nombre"
        />
      </div>

      <div className="comments-field">
        <label className="comments-field-label">Respuesta</label>
        <textarea
          name="comment"
          required
          maxLength={1000}
          rows={3}
          className="comments-textarea"
          placeholder="Escribe tu respuesta..."
        />
      </div>

      {state.error && <p className="comments-error">{state.error}</p>}

      <div className="reply-form-actions">
        <button type="submit" disabled={pending} className="comments-submit reply-submit">
          {pending ? 'Enviando...' : 'Publicar respuesta'}
        </button>
        <button type="button" onClick={onClose} className="reply-cancel">
          Cancelar
        </button>
      </div>
    </form>
  )
}

function CommentItem({
  comment,
  replies,
  slug,
}: {
  comment: Comment
  replies: Comment[]
  slug: string
}) {
  const [showReply, setShowReply] = useState(false)

  return (
    <article className="comment-item">
      <div className="comment-meta">
        <span className="comment-name">{comment.name}</span>
        <time className="comment-date">{formatDate(comment.created_at)}</time>
      </div>
      <p className="comment-body">{comment.comment}</p>

      <button
        type="button"
        className="reply-btn"
        onClick={() => setShowReply((v) => !v)}
      >
        {showReply ? 'Cancelar' : 'Responder'}
      </button>

      {showReply && (
        <ReplyForm slug={slug} parentId={comment.id} onClose={() => setShowReply(false)} />
      )}

      {replies.length > 0 && (
        <div className="replies-thread">
          {replies.map((r) => (
            <article key={r.id} className="reply-item">
              <div className="comment-meta">
                <span className="comment-name">{r.name}</span>
                <time className="comment-date">{formatDate(r.created_at)}</time>
              </div>
              <p className="comment-body">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </article>
  )
}

export default function CommentSection({ slug, initialComments }: Props) {
  const [state, formAction, pending] = useActionState(submitComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  const roots = initialComments.filter((c) => c.parent_id === null)
  const repliesMap = initialComments
    .filter((c) => c.parent_id !== null)
    .reduce((acc, c) => {
      const arr = acc.get(c.parent_id!) ?? []
      arr.push(c)
      acc.set(c.parent_id!, arr)
      return acc
    }, new Map<number, Comment[]>())

  return (
    <section className="comments-section">
      <div className="comments-header">
        <span className="comments-label">Comentarios</span>
        {roots.length > 0 && <span className="comments-count">{roots.length}</span>}
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
        {state.success && (
          <p className="comments-success">
            Tu comentario está pendiente de revisión y se publicará en breve.
          </p>
        )}

        <button type="submit" disabled={pending} className="comments-submit">
          {pending ? 'Enviando...' : 'Publicar comentario'}
        </button>
      </form>

      {roots.length > 0 ? (
        <div className="comments-list">
          {roots.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={repliesMap.get(c.id) ?? []}
              slug={slug}
            />
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
