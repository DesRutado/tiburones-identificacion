import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints/common'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
}

function getText(richText: Array<{ plain_text: string }>): string {
  return richText.map((t) => t.plain_text).join('')
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
  }
}

export async function getPosts(): Promise<Post[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) return []

  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    return response.results
      .filter((p): p is PageObjectResponse => p.object === 'page' && 'properties' in p)
      .map(extractPost)
  } catch {
    return []
  }
}

export async function getPost(
  slug: string
): Promise<{ post: Post; blocks: any[] } | null> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) return null

  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID,
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

    const blocksResponse = await notion.blocks.children.list({
      block_id: page.id,
      page_size: 100,
    })

    return { post, blocks: blocksResponse.results }
  } catch {
    return null
  }
}
