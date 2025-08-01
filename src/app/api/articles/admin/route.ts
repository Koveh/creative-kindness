import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { exec } = require('child_process')
    const util = require('util')
    const execPromise = util.promisify(exec)

    const query = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} psql -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} -t -c "SELECT id, title, author_email, writer, company, status, views, publish_date, description, title_image, link FROM articles ORDER BY created_at DESC;"`

    const { stdout } = await execPromise(query)
    
    const articles = stdout.trim().split('\n').filter((line: string) => line.trim()).map((line: string) => {
      const parts = line.split('|').map((part: string) => part.trim())
      return {
        id: parseInt(parts[0]),
        title: parts[1],
        author_email: parts[2],
        writer: parts[3] || null,
        company: parts[4] || null,
        status: parts[5],
        views: parseInt(parts[6]) || 0,
        publish_date: parts[7] || null,
        description: parts[8] || null,
        title_image: parts[9] || null,
        link: parts[10] || null
      }
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Failed to fetch admin articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}