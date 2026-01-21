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
    const category = searchParams.get('category')

    const client = await pool.connect()
    
    try {
      let query = `
        SELECT DISTINCT ON (LOWER(TRIM(name))) 
          id, name, role, image, description, link, slug, category 
        FROM creators
      `
      const params: any[] = []
      
      if (category) {
        query += ' WHERE category = $1'
        params.push(category)
      }
      
      query += ' ORDER BY LOWER(TRIM(name)), created_at DESC'
      
      const result = await client.query(query, params)
      
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching creators:', error)
    return NextResponse.json({ error: 'Failed to fetch creators' }, { status: 500 })
  }
}
