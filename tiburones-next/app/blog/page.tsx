import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HeroWaves from '@/components/HeroWaves'
import { getPosts, type Post } from '@/lib/notion'
import { getCategoryColor } from '@/lib/categories'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Artículos',
  description:
    'Artículos, guías y curiosidades sobre tiburones. Taxonomía, conservación, distribución y mucho más de la mano de Guillermo Carranza Hidalgo.',
  openGraph: {
    title: 'Artículos — Identificación de Tiburones',
    description: 'Artículos, guías y curiosidades sobre tiburones.',
  },
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function FeaturedPost({ post }: { post: Post }) {
  const categoryColor = getCategoryColor(post.category)
  return (
    <Link href={`/blog/${post.slug}`} className="post-featured">
      <div className="post-featured-visual">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        ) : (
          <div className="post-featured-fallback" style={{ background: categoryColor }}>
            {post.category && <span className="post-category-watermark">{post.category}</span>}
          </div>
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
      </div>
    </Link>
  )
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const categoryColor = getCategoryColor(post.category)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="post-card"
      style={{ '--card-index': index, '--category-color': categoryColor } as React.CSSProperties}
    >
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
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3c-2.5 4-2.5 14 0 18" />
              <path d="M12 3c2.5 4 2.5 14 0 18" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
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
        </div>
      </div>
    </Link>
  )
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category: activeCategory } = await searchParams
  const posts = await getPosts()

  const featured = !activeCategory ? (posts.find((p) => p.featured) ?? posts[0]) : null
  const displayPosts = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : posts.filter((p) => p !== featured)

  const categories = Object.entries(
    posts.reduce((acc, p) => {
      if (p.category) acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])

  return (
    <>
      <Nav />

      <section className="hero blog-hero">
        <HeroWaves compact />
        <div className="hero-content">
          <p className="hero-eyebrow">Guillermo Carranza Hidalgo</p>
          <h1 className="hero-title">Artículos</h1>
        </div>
      </section>

      {categories.length >= 2 && (
        <div className="blog-filters">
          <div className="blog-filters-inner">
            <Link href="/blog" className={`category-pill${!activeCategory ? ' category-pill-active' : ''}`}>
              Todos
            </Link>
            {categories.map(([name, count]) => (
              <Link
                key={name}
                href={`/blog?category=${encodeURIComponent(name)}`}
                className={`category-pill${activeCategory === name ? ' category-pill-active' : ''}`}
              >
                {name}
                <span className="category-pill-count">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="blog-wrapper">
        <div className="blog-content">
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
              {featured && <FeaturedPost post={featured} />}

              {displayPosts.length > 0 ? (
                <div className="posts-grid">
                  {displayPosts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              ) : (
                <p className="blog-empty-filter">No hay artículos en esta categoría.</p>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
