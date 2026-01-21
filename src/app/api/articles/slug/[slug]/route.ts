import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  try {
    const client = await pool.connect()
    
    try {
      const decodedSlug = decodeURIComponent(slug)
      const normalizedSlug = slug.trim()
      const normalizedDecodedSlug = decodedSlug.trim()
      
      console.log('Looking for article with slug:', slug, 'decoded:', decodedSlug)
      
      const result = await client.query(
        `SELECT 
          a.id, 
          a.title, 
          a.content, 
          a.description, 
          a.title_image, 
          a.writer, 
          a.publish_date, 
          a.company,
          a.author_email,
          a.views,
          a.created_at,
          a.updated_at,
          a.link,
          u.name as author_name,
          u.image as author_image
        FROM articles a
        LEFT JOIN users u ON a.author_email = u.email
        WHERE a.status = 'published' 
          AND (
            a.link = $1 
            OR a.link = $2
            OR TRIM(BOTH '/' FROM REPLACE(a.link, '/journal/', '')) = $3
            OR TRIM(BOTH '/' FROM REPLACE(a.link, '/journal/', '')) = $4
          )
        LIMIT 1`,
        [`/journal/${normalizedSlug}`, `/journal/${normalizedDecodedSlug}`, normalizedSlug, normalizedDecodedSlug]
      )
      
      console.log('Query returned', result.rows.length, 'rows')
      
      if (result.rows.length === 0) {
        console.log('Article not found for slug:', slug)
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      
      const row = result.rows[0]
      const article = {
        id: row.id || 0,
        title: row.title || '',
        content: row.content || 'Содержание статьи скоро будет добавлено.',
        description: row.description || '',
        title_image: row.title_image || '',
        writer: row.writer || '',
        publish_date: row.publish_date || '',
        company: row.company || '',
        author_email: row.author_email || '',
        author_name: row.author_name || '',
        author_image: row.author_image || '',
        views: row.views || 0,
        created_at: row.created_at || '',
        updated_at: row.updated_at || '',
        link: row.link || ''
      }

      return NextResponse.json(article)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}