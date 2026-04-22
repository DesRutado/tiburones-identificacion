import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getPost, getPosts } from '@/lib/notion'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getPost(slug)
  if (!data) return {}

  const { post } = data
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

function getRichText(richText: any[]): React.ReactNode {
  return richText.map((t: any, i: number) => {
    let node: React.ReactNode = t.plain_text

    if (t.href) node = <a key={i} href={t.href} target="_blank" rel="noopener noreferrer">{node}</a>
    if (t.annotations?.code) node = <code key={i}>{node}</code>
    if (t.annotations?.bold) node = <strong key={i}>{node}</strong>
    if (t.annotations?.italic) node = <em key={i}>{node}</em>
    if (t.annotations?.strikethrough) node = <s key={i}>{node}</s>
    if (t.annotations?.underline) node = <u key={i}>{node}</u>

    return <span key={i}>{node}</span>
  })
}

function renderBlocks(blocks: any[]): React.ReactNode {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]
    const type = block.type

    if (type === 'bulleted_list_item') {
      const items: React.ReactNode[] = []
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') {
        items.push(<li key={i}>{getRichText(blocks[i].bulleted_list_item.rich_text)}</li>)
        i++
      }
      nodes.push(<ul key={`ul-${i}`}>{items}</ul>)
      continue
    }

    if (type === 'numbered_list_item') {
      const items: React.ReactNode[] = []
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') {
        items.push(<li key={i}>{getRichText(blocks[i].numbered_list_item.rich_text)}</li>)
        i++
      }
      nodes.push(<ol key={`ol-${i}`}>{items}</ol>)
      continue
    }

    switch (type) {
      case 'paragraph':
        nodes.push(
          <p key={block.id}>{getRichText(block.paragraph.rich_text)}</p>
        )
        break
      case 'heading_1':
        nodes.push(
          <h2 key={block.id}>{getRichText(block.heading_1.rich_text)}</h2>
        )
        break
      case 'heading_2':
        nodes.push(
          <h2 key={block.id}>{getRichText(block.heading_2.rich_text)}</h2>
        )
        break
      case 'heading_3':
        nodes.push(
          <h3 key={block.id}>{getRichText(block.heading_3.rich_text)}</h3>
        )
        break
      case 'quote':
        nodes.push(
          <blockquote key={block.id}>{getRichText(block.quote.rich_text)}</blockquote>
        )
        break
      case 'code':
        nodes.push(
          <pre key={block.id}>
            <code>{getRichText(block.code.rich_text)}</code>
          </pre>
        )
        break
      case 'divider':
        nodes.push(<hr key={block.id} />)
        break
      case 'image': {
        const url =
          block.image.type === 'external'
            ? block.image.external.url
            : block.image.file.url
        const caption = block.image.caption?.[0]?.plain_text ?? ''
        nodes.push(
          <img key={block.id} src={url} alt={caption} />
        )
        break
      }
    }

    i++
  }

  return nodes
}

function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getPost(slug)
  if (!data) notFound()

  const { post, blocks } = data

  return (
    <>
      <Nav />

      <div className="post-header">
        {post.category && <span className="post-header-tag">{post.category}</span>}
        <h1 className="post-header-title">{post.title}</h1>
        <div className="post-header-meta">
          <span>{formatDate(post.date)}</span>
          {post.readTime && (
            <>
              <span>·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>
      </div>

      <div className="post-body-wrapper">
        <article className="post-content">
          <Link href="/blog" className="post-back">
            Volver a artículos
          </Link>
          {renderBlocks(blocks)}
        </article>
      </div>

      <Footer />
    </>
  )
}
