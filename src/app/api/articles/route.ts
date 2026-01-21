import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = (page - 1) * limit

    const client = await pool.connect()
    
    try {
      const [articlesResult, countResult] = await Promise.all([
        client.query(
          'SELECT id, title, content, author_email, writer, company, status, views, publish_date, description, title_image, link FROM articles WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
          ['published', limit, offset]
        ),
        client.query(
          'SELECT COUNT(*) FROM articles WHERE status = $1',
          ['published']
        )
      ])
    
      const articles = articlesResult.rows.map((row: any) => {
        const link = row.link || null
        const slug = link ? link.replace('/journal/', '') : null
        
        return {
          id: row.id || 0,
          title: row.title || '',
          content: row.content || null,
          author_email: row.author_email || '',
          writer: row.writer || null,
          company: row.company || null,
          status: row.status || 'draft',
          views: row.views || 0,
          publish_date: row.publish_date || null,
          description: row.description || null,
          title_image: row.title_image || null,
          link: link,
          slug: slug
        }
      })

      const totalCount = parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalCount / limit)
    const hasMore = page < totalPages

      return NextResponse.json({
        articles,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore
        }
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    
    const slug = data.link ? data.link.replace('/journal/', '') : generateSlug(data.title)
    const link = `/journal/${slug}`
    
    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `INSERT INTO articles (title, content, author_email, writer, company, status, description, title_image, link, publish_date) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, ${data.status === 'published' ? 'CURRENT_TIMESTAMP' : 'NULL'})
         RETURNING id`,
        [
          data.title,
          data.content,
          data.author_email,
          data.writer || null,
          data.company || null,
          data.status,
          data.description || null,
          data.title_image || null,
          link
        ]
      )
      
      return NextResponse.json({ 
        success: true, 
        id: result.rows[0].id,
        slug: slug,
        link: link
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}