import { NextResponse } from 'next/server'

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

    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const escapedQuery = query.replace(/"/g, '\\"')
    const pgCommand = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "${escapedQuery}"`

    const { stdout, stderr } = await execPromise(pgCommand)
    
    if (stderr) {
      return NextResponse.json({ error: stderr }, { status: 400 })
    }

    const lines = stdout.trim().split('\n').filter((line: string) => line.trim())
    
    if (lines.length === 0) {
      return NextResponse.json({ results: [] })
    }

    const headerCommand = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} --no-align --tuples-only -c "\\copy (${escapedQuery} LIMIT 0) TO STDOUT WITH CSV HEADER"`
    
    let columns: string[] = []
    try {
      const { stdout: headerStdout } = await execPromise(headerCommand)
      if (headerStdout.trim()) {
        columns = headerStdout.trim().split(',')
      }
    } catch (error) {
      const firstLine = lines[0]
      const parts = firstLine.split('|').map((part: string) => part.trim())
      columns = parts.map((_: string, index: number) => `column_${index + 1}`)
    }

    if (columns.length === 0) {
      const firstLine = lines[0]
      const parts = firstLine.split('|').map((part: string) => part.trim())
      columns = parts.map((_: string, index: number) => `column_${index + 1}`)
    }

    const results = lines.map((line: string) => {
      const parts = line.split('|').map((part: string) => part.trim())
      const row: any = {}
      
      columns.forEach((column, index) => {
        const value = parts[index] || null
        row[column] = value === '' || value === null ? null : value
      })
      
      return row
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
  }
}