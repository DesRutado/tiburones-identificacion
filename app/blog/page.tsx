import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HeroWaves from '@/components/HeroWaves'
import { getPosts, type Post } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Artículos',
  description:
    'Artículos, guías y curiosidades sobre tiburones. Taxonomía, conservación, distribución y mucho más de la mano de Guillermo Carranza Hidalgo.',
  openGraph: {
    title: 'Artículos — Identificación de Tiburones',
    description:
      'Artículos, guías y curiosidades sobre tiburones.',
  },
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function PostCardVisualIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-2.5 4-2.5 14 0 18" />
      <path d="M12 3c2.5 4 2.5 14 0 18" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="post-featured">
      <div className="post-featured-visual">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="#1e3d50" />
            <g opacity="0.15">
              <path d="M-30,220 Q30,180 90,220 Q150,260 210,220 Q270,180 330,220 Q390,260 450,220 Q510,180 570,220 Q630,260 690,220 L690,400 L-30,400 Z" fill="#4a8e8e" />
              <path d="M-30,260 Q30,220 90,260 Q150,300 210,260 Q270,220 330,260 Q390,300 450,260 Q510,220 570,260 L570,400 L-30,400 Z" fill="#2a5060" />
              <path d="M-30,300 Q30,260 90,300 Q150,340 210,300 Q270,260 330,300 Q390,340 450,300 Q510,260 570,300 L570,400 L-30,400 Z" fill="#1e3040" />
            </g>
            <path d="M300,80 C297,110 288,145 272,180 C256,215 238,245 220,268 C240,264 262,262 280,265 C287,266 294,268 300,269 C306,268 313,266 320,265 C338,262 360,264 380,268 C362,245 344,215 328,180 C312,145 303,110 300,80 Z" fill="#3a5566" opacity="0.5" />
          </svg>
        )}
      </div>
      <div className="post-featured-body">
        <span className="post-tag">{post.category}</span>
        <h2 className="post-featured-title">{post.title}</h2>
        <p className="post-featured-excerpt">{post.excerpt}</p>
        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          {post.readTime && (
            <>
              <span>·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
        <Link href={`/blog/${post.slug}`} className="read-more">
          Leer artículo
        </Link>
      </div>
    </article>
  )
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <article className="post-card" style={{ '--card-index': index } as React.CSSProperties}>
      <div className="post-card-visual">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="card-visual-icon">
            <PostCardVisualIcon />
          </div>
        )}
      </div>
      <div className="post-card-body">
        <span className="post-tag">{post.category}</span>
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-footer">
          <div className="post-meta">
            <span>{formatDate(post.date)}</span>
            {post.readTime && (
              <>
                <span>·</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>
          <Link href={`/blog/${post.slug}`} className="read-more">
            Leer
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function BlogPage() {
  const posts = await getPosts()
  const featured = posts[0]
  const rest = posts.slice(1)

  const recentPosts = posts.slice(0, 4)

  return (
    <>
      <Nav />

      <section className="hero blog-hero">
        <HeroWaves compact />
        <div className="hero-content">
          <p className="hero-eyebrow">Guillermo Carranza Hidalgo</p>
          <h1 className="hero-title">
            Artículos <em>&amp;</em> Guías
          </h1>
        </div>
      </section>

      <div className="blog-wrapper">
        <main className="blog-main">
          {posts.length === 0 ? (
            <div className="blog-empty">
              <h2 className="blog-empty-title">Los artículos llegan pronto</h2>
              <p className="blog-empty-sub">
                Guillermo está preparando contenido sobre identificación de tiburones,
                taxonomía y conservación marina.
              </p>
            </div>
          ) : (
            <>
              {/* Columna principal */}
              <div>
                {featured && <FeaturedPost post={featured} />}

                {rest.length > 0 && (
                  <div className="posts-grid">
                    {rest.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i + 1} />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-block sidebar-about">
                  <Image src="/img3.webp" alt="Logo Identificación de Tiburones" width={64} height={64} />
                  <div className="sidebar-about-name">Guillermo Carranza Hidalgo</div>
                  <p className="sidebar-about-bio">
                    Naturalista especializado en elasmobranquios. Autor de la guía de identificación
                    de tiburones más completa en español.
                  </p>
                </div>

                {recentPosts.length > 0 && (
                  <div className="sidebar-block">
                    <div className="sidebar-title">Artículos recientes</div>
                    <div className="sidebar-recent">
                      {recentPosts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="sidebar-recent-item">
                          <span className="sidebar-recent-title">{post.title}</span>
                          <span className="sidebar-recent-date">{formatDate(post.date)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}
