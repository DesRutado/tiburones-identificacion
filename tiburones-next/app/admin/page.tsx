import { redirect } from 'next/navigation'
import { getPendingComments, approveComment, rejectComment } from '@/app/actions/admin'

interface AdminPageProps {
  searchParams: Promise<{ key?: string }>
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { key } = await searchParams

  if (!process.env.ADMIN_SECRET || key !== process.env.ADMIN_SECRET) {
    redirect('/')
  }

  const pending = await getPendingComments()
  const boundApprove = approveComment.bind(null, key)
  const boundReject = rejectComment.bind(null, key)

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Moderación de comentarios</h1>
        <span className="admin-count">
          {pending.length} {pending.length === 1 ? 'pendiente' : 'pendientes'}
        </span>
      </div>

      {pending.length === 0 ? (
        <p className="admin-empty">No hay comentarios pendientes de moderación.</p>
      ) : (
        <div className="admin-list">
          {pending.map((c) => (
            <div key={c.id} className="admin-item">
              <div className="admin-item-meta">
                <span className="admin-item-slug">{c.article_slug}</span>
                <span className="admin-item-date">{formatDate(c.created_at)}</span>
                {c.parent_id !== null && (
                  <span className="admin-item-badge">Respuesta</span>
                )}
              </div>
              <p className="admin-item-name">{c.name}</p>
              <p className="admin-item-body">{c.comment}</p>
              <div className="admin-item-actions">
                <form action={boundApprove}>
                  <input type="hidden" name="comment_id" value={c.id} />
                  <button type="submit" className="admin-btn admin-btn-approve">
                    Aprobar
                  </button>
                </form>
                <form action={boundReject}>
                  <input type="hidden" name="comment_id" value={c.id} />
                  <button type="submit" className="admin-btn admin-btn-reject">
                    Rechazar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
