import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -c "SELECT * FROM articles ORDER BY created_at DESC;" --csv`

    const { stdout } = await execPromise(query)
    
    const lines = stdout.trim().split('\n')
    const headers = lines[0].split(',')
    
    const articles = lines.slice(1).map((line: string) => {
      const values = line.split(',')
      const article: any = {}
      headers.forEach((header: string, index: number) => {
        article[header] = values[index] || null
      })
      return article
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Failed to fetch admin articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}