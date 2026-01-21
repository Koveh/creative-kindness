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
      const result = await client.query(
        'SELECT id, name, role, image, description, link, slug, category FROM creators WHERE slug = $1 OR slug = $2 LIMIT 1',
        [slug, decodedSlug]
      )
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
      }
      
      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching creator:', error)
    return NextResponse.json({ error: 'Failed to fetch creator' }, { status: 500 })
  }
}
