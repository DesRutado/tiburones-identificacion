import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  coverImage: string | null
}

function getText(richText: Array<{ plain_text: string }>): string {
  return richText.map((t) => t.plain_text).join('')
}

function extractCoverImage(props: Record<string, any>): string | null {
  const file = props.CoverImage?.files?.[0]
  if (!file) return null
  return file.type === 'external' ? file.external.url : file.file?.url ?? null
}

function extractPost(page: PageObjectResponse): Post {
  const props = page.properties as Record<string, any>
  return {
    id: page.id,
    slug: getText(props.Slug?.rich_text ?? []),
    title: getText(props.Title?.title ?? []),
    excerpt: getText(props.Excerpt?.rich_text ?? []),
    category: props.Category?.select?.name ?? '',
    date: props.Date?.date?.start ?? '',
    readTime: getText(props.ReadTime?.rich_text ?? []),
    coverImage: extractCoverImage(props),
  }
}

export async function getPosts(): Promise<Post[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) return []

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    return response.results
      .filter((p): p is PageObjectResponse => p.object === 'page' && 'properties' in p)
      .map(extractPost)
  } catch (err) {
    console.error('[notion] getPosts error:', err)
    return []
  }
}

async function fetchBlocksDeep(blockId: string): Promise<any[]> {
  const response = await notion.blocks.children.list({ block_id: blockId, page_size: 100 })
  const blocks = response.results as any[]

  for (const block of blocks) {
    if (block.type === 'column_list' && block.has_children) {
      const colsResponse = await notion.blocks.children.list({ block_id: block.id, page_size: 100 })
      block.children = await Promise.all(
        (colsResponse.results as any[]).map(async (col) => {
          if (col.has_children) {
            const contentResponse = await notion.blocks.children.list({ block_id: col.id, page_size: 100 })
            col.children = contentResponse.results
          } else {
            col.children = []
          }
          return col
        })
      )
    }
  }

  return blocks
}

export async function getPost(
  slug: string
): Promise<{ post: Post; blocks: any[] } | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) return null

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
    })

    const page = response.results.find(
      (p): p is PageObjectResponse => p.object === 'page' && 'properties' in p
    )
    if (!page) return null

    const post = extractPost(page)

    const blocks = await fetchBlocksDeep(page.id)

    return { post, blocks }
  } catch (err) {
    console.error('[notion] getPost error:', err)
    return null
  }
}
