import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const trimmedQuery = query.trim().toLowerCase()
    if (!trimmedQuery.startsWith('select')) {
      return NextResponse.json({ error: 'Only SELECT queries are allowed' }, { status: 400 })
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(query)
      
      if (result.rows.length === 0) {
        return NextResponse.json({ results: [] })
      }

      const columns = result.fields.map(field => field.name)
      const results = result.rows.map((row: any) => {
        const rowData: any = {}
        columns.forEach((column) => {
          rowData[column] = row[column] ?? null
        })
        return rowData
      })

      return NextResponse.json({ results })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Database query error:', error)
    return NextResponse.json({ 
      error: error.message || 'Database query failed' 
    }, { status: 500 })
  }
}